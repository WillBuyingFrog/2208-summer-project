import * as Y from 'yjs'
import { WebsocketProvider } from "y-websocket";
import {findComponent, findComponentPathById, updateTreeIn} from "@/views/prototype-design/utils/index";


export function parseControls(controls, isRoot=1){
    let retJSON = []

    controls.map((item) => {
        // console.log("Checking component" + item.id)
        if(!item.parentId){
            // console.log("   This component is on root-editor!")
        }
        let componentHasChild = false
        let childJSON = []
        if(item.type === 'container'){
            // 或许可以直接用type是不是container判定？
            // console.log("   This component has children!")
            componentHasChild = true
            childJSON = parseControls(item.children, 0)
        }
        let itemJSON = {
            // hasChild指示当前元素是否有子元素
            ...item,
            children: [],
            hasChild: componentHasChild,
            childrenJSON: childJSON
        }
        retJSON.push(itemJSON)
        return itemJSON
    })
    if(isRoot) return retJSON
    else{
        return JSON.stringify({
            components: retJSON
        })
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
 * 协作编辑 本地标记函数
 */

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
 * 这个函数会将他和他的所有层次的子元素全部打上指定的usedBy标记。
 */
export function markLocalComponentOccupation(application, component, mark){
    component.usedBy = mark
    if(component.type === 'container'){
        for(let child in component.children){
            markLocalComponentOccupation(application, child, mark)
        }
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

export const monitorTransforms = [
    'x', 'y', 'transform', 'resizable', 'draggable', 'acceptRatio', 'active',
]

export const monitorExtraTransforms = [
    'label',
]

/**
 * 同步实时协作时对组件的更改。
 * @param application DesignApp
 * @param componentJSON 接收到的样式更改信息。格式是服务端JSON，但抹掉了children和childrenJSON以节省大小。
 */
export function syncComponentTransforms(application, componentJSON, isLock=true){
    let newValues = JSON.parse(componentJSON)
    newValues['components'].map((newValue) => {
        // 根据实时协作传回的id，找到组件存放的path
        let localPath = findComponentPathById(application.controls, newValue.id)
        let newControls = updateTreeIn(application.controls, localPath, (item) => {
            // 更新所有需要实时同步的属性
            monitorTransforms.map((key) => {
                // 完全仿照updateControlValue函数
                if (['x', 'y', 'width', 'height', 'rotation'].includes(key)) {
                    let transform = {...item.transform}
                    transform[key] = newValue[key]
                    item.transform = transform
                }else{
                    // 不需要更新transform
                    // 但在控件被锁定时，也不能更新draggable，resizable，active
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

/**
 * 在本地添加实时协作的元素。
 * @param application
 * @param componentJSON
 */

export function addCollaborateComponent(application, componentJSON, isLock=1){
    let newValues = JSON.parse(componentJSON)
    newValues.map((newValue) => {
        if(isLock === 1){
            newValue.draggable = false
            newValue.resizable = false
            newValue.active = false
        }
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


export function enableComponent(application, componentId){
    console.log(application)
    console.log(componentId)
}


export const sharedDocMap = new Map()

export function getCollaboratePrototype(application, file_id){

    if(sharedDocMap.get(file_id)){
        // 已经创建了该file_id对应的房间
        return sharedDocMap.get(file_id)
    }
    console.log("Create new room with file_id:", file_id)
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

    const newMap = newDoc.getMap(file_id)  // 在doc内创建一个map
    collaboratePrototypeConfig.map = newMap

    newMap.observe(yMapEvent => {
        yMapEvent.changes.keys.forEach((change, key) => {
            if(change.action === 'add'){
                console.log(`Property "${key}" was added. Initial value: "${newMap.get(key)}".`)
                let componentJSON = newMap.get(key)
                let componentServerSide = JSON.parse(componentJSON)
                componentServerSide = componentServerSide[0]
                console.log("Component is used by: ", componentServerSide.usedBy, application.$store.state.user.id)
                // 只针对其他用户的更改实时更改本地渲染
                if(!(componentServerSide.usedBy === '__none__' ||
                    componentServerSide.usedBy === application.$store.state.user.id)) {
                    // 其他用户选择了该component，本地先上锁
                    // 上锁需要从根元素开始
                    // let temp = findComponent(application.controls, (item) => {
                    //     return item.id === componentServerSide.id
                    // })
                    // let rootComponent = findRootComponent(application, temp)
                    // lockComponents(application, rootComponent.id)
                    // 再添加元素

                    // 在本地寻找元素
                    let localComponent = findComponent(application.controls,
                        (item) => {return item.id === componentServerSide.id})

                    if(localComponent){
                        // 第一种情况：本地已经有这个元素了，那么使用实时协作的版本无条件覆盖
                        syncComponentTransforms(application, componentJSON)
                    }else{
                        // 第二种情况：本地没有这个元素，这是协作编辑的元素
                        addCollaborateComponent(application, componentJSON)
                    }

                }
            }else if(change.action === 'update'){
                console.log(`Property "${key}" was updated. New value: "${newMap.get(key)}". Previous value: "${change.oldValue}".`)
                let componentJSON = newMap.get(key)
                // 服务器端格式的Component
                // 即：children被手动置空，信息保存在childrenJSON中
                let componentServerSide = JSON.parse(componentJSON)
                componentServerSide = componentServerSide[0]
                // 只针对其他用户的更改实时更改本地渲染
                if(!(componentServerSide.usedBy === '__none__' ||
                    componentServerSide.usedBy === application.$store.state.user.id)){
                    // 其他用户选择了该component，本地先上锁
                    // 上锁需要从根元素开始
                    let rootComponent = findRootComponent(application,
                        findComponent(application.controls, (item) => {return item.id === componentServerSide.id}))
                    lockComponents(application, rootComponent.id)
                    // 再同步变化
                    syncComponentTransforms(application, componentJSON)
                }else{
                    // 该component可以被本地用户使用，本地解锁

                }


            }else if(change.action === 'delete'){
                console.log(`Property "${key}" was deleted. New value: undefined. Previous value: "${change.oldValue}".`)
            }
        })
    })


    sharedDocMap.set(file_id, collaboratePrototypeConfig)

    console.log("End collaboratePrototypeConfig")

    return collaboratePrototypeConfig
}

/**
 * 给定当前用户选择的元素，更新实时文档中的信息。
 * 本函数应当在用户选中组件、更改组件样式时调用。
 * @param application DesignApp应用
 * @param file_id 页面对应的文件id
 * @param component 根组件。
 * @returns {number}
 */

export function updateCollaborateComponent(application, file_id, component){
    if(sharedDocMap.get(file_id)){
        console.log("Find existing doc")
        let componentJSON = parseControlsCollaborate([component])
        let collaborateConfig = sharedDocMap.get(file_id)
        let collaborateMap = collaborateConfig.map
        collaborateMap.set(component.id, componentJSON)
    }else{
        return -1
    }
}


/**
 * 分页原型设计 调试函数
 */


export function demoMultiPage(){
    let JSONInformation = {
        pages: [
            {
                page_index: 1,
                page_file_id: "a9eda713-c637-49f6-b4a5-56a0f88caaa4"  // summer-project-my-ass
            },
            {
                page_index: 2,
                page_file_id: "dcc491d6-f029-4fc9-9ac8-97362f85e114"  // I-wanna-remake
            }
        ]
    }
    return JSON.stringify(JSONInformation)
}
