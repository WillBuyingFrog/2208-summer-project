import * as Y from "yjs";
import {WebsocketProvider} from "y-websocket";
import {findComponent, findComponentPathById, updateTreeIn} from "@/views/prototype-design/utils/index";
import {
    monitorTransforms
} from "@/views/prototype-design/utils/collaborate";


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
        console.log(typeof localPath)

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

            // TODO 监听extra的更改

            return item
        })
        application.controls = newControls
    })
}


export const sharedDocMap = new Map()

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
        "ws://localhost:1234",
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
                console.log("Map updates")

                // 只针对其他用户的更改实时更改本地渲染
                if(!(componentServerSide.usedBy === '__none__' ||
                    componentServerSide.usedBy === application.$store.state.user.id)) {
                    // 本地对应的所有层次元素都需要上锁
                    let localCurrentComponent = findComponent(application.controls,
                        (item) => {return item.id === componentServerSide.id})
                    console.log("Get local current component:", localCurrentComponent)
                    let rootComponent = findRootComponent(application, localCurrentComponent)
                    console.log("Root component:", rootComponent)
                    // 从根元素开始一路向下锁
                    lockComponents(application, rootComponent.id)
                    // 再同步变化
                    level_syncComponentTransforms(application, componentJSON)
                }
            }else if(change.action === 'delete'){
               console.log(`Property "${key}" was deleted. New value: undefined. Previous value: "${change.oldValue}".`)
                let componentJSON = change.oldValue
                let componentServerSide = JSON.parse(componentJSON)
                componentServerSide = componentServerSide[0]
                // 如果是自己删除的，就直接返回
                if(componentServerSide.usedBy === application.$store.state.user.id){
                    return
                }
                // 如果不是自己删除的，那么还需要在画布上展示
                deleteCollaborateComponent(application, componentJSON)
            }
        })
    })

    sharedDocMap.set(file_id, collaboratePrototypeConfig)

    console.log("End collaboratePrototypeConfig")

    return collaboratePrototypeConfig
}

/**
 * 给定当前用户选择的元素，更新实时文档中的信息。
 * 本函数应当在用户新建组件、选中组件、更改组件样式和取消选择组件时调用。
 * @param application DesignApp应用
 * @param file_id 页面对应的文件id
 * @param component 根组件。
 * @returns {number}
 */

export function level_updateCollaborateComponent(application, file_id, component){
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

export function level_deleteCollaborateComponent(application, file_id, componentId){
    if(sharedDocMap.get(file_id)){
        console.log("Ready to delete", componentId)
        let collaborateConfig = sharedDocMap.get(file_id)
        let collaborateMap = collaborateConfig.map
        collaborateMap.delete(componentId)
    }else{
        return -1
    }
}


// eslint-disable-next-line no-unused-vars
export function level_switchPage(application, newPageIndex){

}
