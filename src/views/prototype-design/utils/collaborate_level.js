import * as Y from "yjs";
import {WebsocketProvider} from "y-websocket";
import {findComponent, findComponentPathById, updateTreeIn} from "@/views/prototype-design/utils/index";


/**
 * 返回一个组件对应的根画布组件。
 * @param application DegisnApp实例
 * @param component 当前元素
 * @returns {*} 一个Object，为当前组件对应的根画布组件。
 */
export function findRootComponent(application, component){
    if(component.parentId){
        let father = findComponent(application.controls, (item) => {return item.id === component.parentId})
        return findRootComponent(application, father)
    }else{
        return component
    }
}

/**
 * 实时协作过程中，锁定usedBy标记为别的用户的组件**一路上所有层次的组件**。
 * @param application
 * @param componentId 需要上锁的组件的id。第一次调用此函数时，应当传入一个根组件的id。
 * @param directComponent 在递归调用时，将item直接传入，可以节省时间
 */
export function lockComponents(application, componentId, directComponent=null){
    let component = null
    if(directComponent){
        component = directComponent
    }else{
        component = findComponent(application.controls, (item) => {return item.id === componentId})
    }
    // 上锁
    component.draggable = false
    component.resizable = false
    component.active = false

    if(component.type === 'container'){
        // 可能有子元素
        component.children.map((item => {
            lockComponents(application, item.id, item)
        }))
    }
}

/**
 * 实时协作过程中，组件恢复到空闲状态时，恢复组件可选中状态。
 * @param application
 * @param componentId 需要上锁的组件的id。第一次调用此函数时，应当传入一个根组件的id。
 * @param directComponent 在递归调用时，将item直接传入，可以节省时间
 */
export function unlockComponents(application, componentId, directComponent=null){
    let component = null
    if(directComponent){
        component = directComponent
    }else{
        component = findComponent(application.controls, (item) => {return item.id === componentId})
    }
    // 解锁
    component.draggable = true
    component.resizable = true
    if(component.type === 'container'){
        // 可能有子元素
        component.children.map((item => {
            unlockComponents(application, item.id, item)
        }))
    }
}

/**
 * 给定一个组件数组，返回这组组件的位置及变换信息。
 * 所有children，childJSON都会被置空。
 * @param components 一个组件数组。
 */
export function parseControlsCollaborate(components){
    let temp = components.map((item) => {
        return {
            ...item,
            // 清空children和childrenJSON以节省空间
            children: [],
            childrenJSON: JSON.stringify({
                components: []
            })
        }
    })
    return JSON.stringify(temp)
}



/**
 * 在本地画布上添加元素。
 * @param application
 * @param componentJSON
 */

export function addCollaborateComponent(application, componentJSON, isLock=1){
    let newValues = JSON.parse(componentJSON)
    // 注意！只渲染其他用户添加进来的元素
    newValues.map((newValue) => {
        newValue.active = false
        if(isLock === 1){
            newValue.draggable = false
            newValue.resizable = false

        }else{
            newValue.draggable = true
            newValue.resizable = true
            newValue.usedBy = '__none__'
        }
        console.log("Adding new component to canvas:", newValue)
        application.addControl({
            components: [newValue],
            parentId: newValue.parentId,
            isReload: 2
        })
    })
}


/**
 * 在本地删除实时协作的元素。
 * @param application
 * @param componentJSON
 */

export function deleteCollaborateComponent(application, componentJSON){
    let newValues = JSON.parse(componentJSON)
    newValues.map((newValue) => {
        let localPath = findComponentPathById(application.controls, newValue.id)
        let controls = updateTreeIn(application.controls, localPath, () => false)
        application.controls = controls
    })
}

export const monitorExtraTransforms = [
    'value', 'checked', 'usedBy'
]
export const monitorTransforms = [
    'x', 'y', 'transform', 'acceptRatio', 'usedBy'
]


/**
 * 同步实时协作时对组件的更改。
 * @param application DesignApp
 * @param componentJSON 接收到的样式更改信息。格式是服务端JSON，但抹掉了children和childrenJSON以节省大小。
 */
export function level_syncComponentTransforms(application, componentJSON, isLock=true){
    let newValues = JSON.parse(componentJSON)
    newValues.map((newValue) => {
        // 根据实时协作传回的id，找到组件存放的path
        let localPath = findComponentPathById(application.controls, newValue.id)
        localPath = localPath.path

        let newControls = updateTreeIn(application.controls, localPath, (item) => {
            // 更新所有需要实时同步的属性
            monitorTransforms.map((key) => {
                // 完全仿照updateControlValue函数
                if (['x', 'y', 'width', 'height', 'rotation'].includes(key)) {
                    let transform = {...item.transform}
                    transform[key] = newValue[key]
                    item.transform = transform
                }else{
                    // 在控件被锁定时，不能更新draggable，resizable，active
                    if(isLock && (['draggable', 'resizable', 'active'].includes(key))){
                        item[key] = false
                    }else{
                        item[key] = newValue[key]
                    }
                }
            })
            // 监听extra的更改
            monitorExtraTransforms.map((key) => {
                if(newValue.extra[key])
                    item.extra[key] = newValue.extra[key]
            })
            console.log("Altered control:", item)
            return item
        })
        application.controls = newControls
    })
    console.log("New set of controls:", application.controls)
}

export const sharedDocMap = new Map()

export const sharedPreviewDocMap = new Map()

export function level_getPreviewCollaboratePrototype(application, file_id){

    if(sharedPreviewDocMap.get(file_id)){
        // 已经创建了该file_id对应的房间
        return sharedPreviewDocMap.get(file_id)
    }

    // 没有创建过房间，新建一个
    let collaboratePrototypeConfig = {
        doc: null,
        provider: null,
        awareness: null,
        map: null,
    }
    const newDoc = new Y.Doc()
    collaboratePrototypeConfig.doc = newDoc
    const provider = new WebsocketProvider(
        "ws://49.232.135.90:1234",
        file_id,  // 房间号即为当前的页面id（页面隶属于某个原型设计，但我们不关心）
        newDoc
    )
    collaboratePrototypeConfig.provider = provider

    console.log("Create new preview room with file_id:", file_id)

    const newMap = newDoc.getMap(file_id)  // 在doc内创建一个map
    collaboratePrototypeConfig.map = newMap

    newMap.observe(yMapEvent => {
        yMapEvent.changes.keys.forEach((change, key) => {
            if(change.action === 'add'){
                // console.log(`Property "${key}" was added. Initial value: "${newMap.get(key)}".`)
                let componentJSON = newMap.get(key)
                let componentServerSide = JSON.parse(componentJSON)
                componentServerSide = componentServerSide[0]
                let localComponent = findComponent(application.controls,
                    (item) => {return item.id === componentServerSide.id})
                if(localComponent){
                    console.log("We already have the component. Skipping.")
                }else{
                    addCollaborateComponent(application, componentJSON)
                }
            }else if(change.action === 'update'){
                let componentJSON = newMap.get(key)
                let componentServerSide = JSON.parse(componentJSON)
                componentServerSide = componentServerSide[0]
                // 预览模式，无条件更新且上锁
                let localCurrentComponent = findComponent(application.controls,
                    (item) => {return item.id === componentServerSide.id})
                console.log("Get local current component:", localCurrentComponent)
                let rootComponent = findRootComponent(application, localCurrentComponent)
                console.log("Root component:", rootComponent)
                // 从根元素开始一路向下锁
                lockComponents(application, rootComponent.id)
                // 再同步变化
                level_syncComponentTransforms(application, componentJSON)
            }else if(change.action === 'delete'){
                // 无条件删除本地内容
                let componentJSON = change.oldValue
                deleteCollaborateComponent(application, componentJSON)
            }
        })
    })

    sharedPreviewDocMap.set(file_id, collaboratePrototypeConfig)
    console.log("End collaboratePreviewPrototypeConfig")
    return collaboratePrototypeConfig
}

export function level_getCollaboratePrototype(application, file_id){

    if(sharedDocMap.get(file_id)){
        // 已经创建了该file_id对应的房间
        return sharedDocMap.get(file_id)
    }

    // 没有创建过房间，新建一个
    let collaboratePrototypeConfig = {
        doc: null,
        provider: null,
        awareness: null,
        map: null,
    }
    const newDoc = new Y.Doc()
    collaboratePrototypeConfig.doc = newDoc
    const provider = new WebsocketProvider(
        "ws://49.232.135.90:1234",
        file_id,  // 房间号即为当前的页面id（页面隶属于某个原型设计，但我们不关心）
        newDoc
    )
    collaboratePrototypeConfig.provider = provider

    // awareness
    const awareness = provider.awareness

    awareness.setLocalState({
        userId: application.$store.state.user.id,
        username: application.$store.state.user.name
    })

    awareness.on('change', ({added, updated, removed}) => {
        if(added.length > 0){
            // 新用户进入
        }
        if(updated.length > 0){
            // 暂未定义
        }
        if(removed.length > 0){
            // 有用户登出
        }
    })

    console.log("Create new room with file_id:", file_id)

    const newMap = newDoc.getMap(file_id)  // 在doc内创建一个map
    collaboratePrototypeConfig.map = newMap

    newMap.observe(yMapEvent => {
        yMapEvent.changes.keys.forEach((change, key) => {
            if(change.action === 'add'){
                // console.log(`Property "${key}" was added. Initial value: "${newMap.get(key)}".`)
                let componentJSON = newMap.get(key)
                let componentServerSide = JSON.parse(componentJSON)
                componentServerSide = componentServerSide[0]

                let localComponent = findComponent(application.controls,
                    (item) => {return item.id === componentServerSide.id})

                if(localComponent){
                    console.log("We already have the component. Skipping.")
                }else{
                    if(!(componentServerSide.usedBy === '__none__' ||
                        componentServerSide.usedBy === application.$store.state.user.id)) {
                        // 是其他用户创建的，创建时需要上锁
                        addCollaborateComponent(application, componentJSON)
                    }else{
                        // 不用上锁
                        addCollaborateComponent(application, componentJSON, 0)
                    }
                }

            }else if(change.action === 'update'){

                let componentJSON = newMap.get(key)
                let componentServerSide = JSON.parse(componentJSON)
                componentServerSide = componentServerSide[0]
                console.log("Received update event.", componentServerSide)
                let rootComponent = findRootComponent(application,
                    findComponent(application.controls, (item) => {return item.id === componentServerSide.id}))
                // 只针对其他用户的更改实时更改本地渲染
                if(!(componentServerSide.usedBy === '__none__' ||
                    componentServerSide.usedBy === application.$store.state.user.id)) {
                    // 是其他用户的更改，本地对应的所有层次元素都需要上锁
                    // 从根元素开始一路向下锁
                    lockComponents(application, rootComponent.id)
                    // 再同步变化
                    level_syncComponentTransforms(application, componentJSON)
                }else {
                    unlockComponents(application, rootComponent.id)
                    // 再同步变化
                    // 这个函数默认上锁！！！
                    level_syncComponentTransforms(application, componentJSON, false)
                }
            }else if(change.action === 'delete'){
               console.log(`Property "${key}" was deleted. New value: undefined. Previous value: "${change.oldValue}".`)
                let componentJSON = change.oldValue
                let componentServerSide = JSON.parse(componentJSON)
                componentServerSide = componentServerSide[0]
                // 如果是自己删除的，并且也不在预览模式，就直接返回
                if(componentServerSide.usedBy === application.$store.state.user.id){
                    return
                }
                // 如果不是自己删除的，那么还需要在画布上更改
                deleteCollaborateComponent(application, componentJSON)
            }
        })
    })

    sharedDocMap.set(file_id, collaboratePrototypeConfig)

    console.log("End collaboratePrototypeConfig")

    return collaboratePrototypeConfig
}

export async function level_initTemplateContents(application, prototype_id, template_id){

    let templateContent = null
    let allPages = null

    // eslint-disable-next-line no-unused-vars
    let temp1 = await application.$http
        .post('/template/getProtoTemplate', {
            template_id: template_id.toString()
        })
        .then(res => {
            switch (res.data.code){
                case 200:
                    templateContent = res.data.data
                    console.log("Successfully get template data. ")
            }
        })
    // eslint-disable-next-line no-unused-vars
    let temp2 = await application.$http
        .post('/file/page/get', {
            prototype_id: prototype_id
        })
        .then(res => {
            switch (res.data.code){
                case 200:
                    allPages = res.data.data
                    console.log("SUccessfully get pages.")
            }
        })

    console.log("Template contents:", templateContent)
    console.log("All pages:", allPages)

    // 遍历模板中的所有页
    let templatePages = JSON.parse(templateContent.pages)
    templatePages.map((page) => {
        let correspondingPageId = null
        // 暴力法，从所有已经创建好的page中找到page_index为page.page_index的页面id
        allPages.map((item) => {
            if(item.page_index === page.page_index){
                correspondingPageId = item.page_id
            }
        })
        let initComponents = JSON.parse(page.components)
        level_initSinglePageContent(correspondingPageId, initComponents)
    })
}


export function level_initSinglePageContent(page_id, components){
    console.log("Ready to initialize", page_id, "with following components:", components)

    const newDoc = new Y.Doc()
    // eslint-disable-next-line no-unused-vars
    const provider = new WebsocketProvider(
        "ws://49.232.135.90:1234",
        page_id,  // 房间号即为当前需要初始化的页面id
        newDoc
    )
    const newMap = newDoc.getMap(page_id)

    console.log("Created temporary connection to room", page_id)

    function generateId() {
        return (
            Date.now() +
            Math.random()
                .toString()
                .slice(2)
        )
    }

    components.map((component) => {
        component.id = generateId()
        component.usedBy = '__none__'
        component.extra.usedBy = '__none__'
        newMap.set(component.id, "[" + JSON.stringify(component) + "]")
    })

    setTimeout(() => {
        provider.disconnect()
        provider.destroy()
        newDoc.destroy()
    }, 10000)

    console.log("Disconnected from room", page_id)
}

/**
 * 给定当前用户选择的元素，更新实时文档中的信息。
 * 本函数应当在用户新建组件、选中组件、更改组件样式和取消选择组件时调用。
 * @param application DesignApp应用
 * @param file_id 页面对应的文件id
 * @param component 根组件。
 * @returns {number}
 */

export function level_updateCollaborateComponent(application, file_id, component, isPreview=0){
    if(isPreview){
        if(sharedPreviewDocMap.get(file_id)){
            let componentJSON = parseControlsCollaborate([component])
            let collaborateConfig = sharedPreviewDocMap.get(file_id)
            let collaborateMap = collaborateConfig.map
            console.log("Update:", componentJSON)
            collaborateMap.set(component.id, componentJSON)
        }else{
            return -1
        }
    }else{
        if(sharedDocMap.get(file_id)){
            let componentJSON = parseControlsCollaborate([component])
            let collaborateConfig = sharedDocMap.get(file_id)
            let collaborateMap = collaborateConfig.map
            console.log("Update:", componentJSON)
            collaborateMap.set(component.id, componentJSON)
        }else{
            return -1
        }
    }

}

export function level_deleteCollaborateComponent(application, file_id, componentId, isPreview=0){
    if(isPreview){
        if(sharedPreviewDocMap.get(file_id)){
            console.log("Ready to delete", componentId)
            let collaborateConfig = sharedPreviewDocMap.get(file_id)
            let collaborateMap = collaborateConfig.map
            collaborateMap.delete(componentId)
        }else{
            return -1
        }
    }else{
        if(sharedDocMap.get(file_id)){
            console.log("Ready to delete", componentId)
            let collaborateConfig = sharedDocMap.get(file_id)
            let collaborateMap = collaborateConfig.map
            collaborateMap.delete(componentId)
        }else{
            return -1
        }
    }

}

/**
 * 连接指定文件id的页面，并断开与之前页面的连接
 * @param application DesignApp实例
 * @param newPageFileId 新的页面的文件id
 */
export function level_switchPage(application, newPageFileId, isPreview=0){
    // 断开与之前页面的连接
    let collaborateConfig = null
    if(isPreview){
        collaborateConfig = sharedPreviewDocMap.get(application.previewPageId)
    }else{
        collaborateConfig = sharedDocMap.get(application.currentPage.page_id)
    }
    let collaborateDoc = collaborateConfig.doc
    let collaborateProvider = collaborateConfig.provider
    if(isPreview){
        sharedPreviewDocMap.delete(application.previewPageId)
    }else{
        sharedDocMap.delete(application.currentPage.page_id)
    }
    // 清除连接和缓存
    collaborateProvider.disconnect()
    collaborateProvider.destroy()
    collaborateDoc.destroy()

    // 清除本地画布及所有的选择状态
    application.setControls([])
    application.clearCurrentComponent()
    // 将新页面标记为newPageFileId所在的页面
    application.pages.map((page) => {
        if(page.page_id === newPageFileId){
            application.currentPage = page
        }
    })
    // 新建与新页面的连接
    if(isPreview){
        level_getPreviewCollaboratePrototype(application, newPageFileId)
    }else{
        level_getCollaboratePrototype(application, newPageFileId)
    }



}





/**
 * 脱机模式下的多页面调试函数。
 * @param application
 */

export function level_multiPageDemo(application){
    application.file_id = application.$store.state.file_id // 原型设计的id
    application.file_name = application.$store.state.file_name  // 原型设计名称
    application.userId = application.$store.state.user.id

    application.pages.push({
        page_index: 1,
        page_file_id: "testtest",
        page_name: "lalala",
        width: 900,
        height: 900
    })
    application.pages.push({
        page_index: 2,
        page_file_id: "anotherPage",
        page_name: "lelele",
        width: 900,
        height: 900
    })
    application.currentPage = application.pages[0]
    application.$store.state.user.id = prompt("输入测试用户名")
    application.$store.state.user.name = application.$store.state.user.id + "---"
    level_getCollaboratePrototype(application, application.currentPage.page_id)
}
