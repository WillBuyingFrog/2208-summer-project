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
 * 实时协作过程中，锁定usedBy标记为别的用户的组件。
 * 传入的
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
 * 实时协作过程中，同步组件状态。
 * @param application
 * @param componentJSON 传入的服务器端格式的组件JSON。第一次调用该函数时，应该只有一个component。
 */

export const monitorKeys = [
    'x', 'y',
]

export function syncComponentTransforms(application, componentJSON){
    let parsedComponents = JSON.parse(componentJSON)
    parsedComponents['components'].forEach((item) => {
        // eslint-disable-next-line no-unused-vars
        let localComponent = findComponent(application.controls, (obj) => {return item.id === obj.id})
        // 在这里可以直接更改这个component的值
        // 仿照官方写法更改component的值：找到path => updateTreeIn
        let path = findComponentPathById(application.controls, item.id)
        // eslint-disable-next-line no-unused-vars
        let modifiedLocalComponent = updateTreeIn(application.controls, path, (obj) => {
        })
    })
}

export function disableComponent(application, componentId){
    console.log(application)
    console.log(componentId)
}

export function enableComponent(application, componentId){
    console.log(application)
    console.log(componentId)
}


export const sharedDocMap = new Map()

export function getCollaboratePrototype(application, file_id){
    return ;
    // eslint-disable-next-line no-unreachable
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

    const newMap = new Y.Map()
    collaboratePrototypeConfig.map = newMap

    newMap.observe(yMapEvent => {
        yMapEvent.changes.keys.forEach((change, key) => {
            if(change.action === 'add'){
                console.log(`Property "${key}" was added. Initial value: "${newMap.get(key)}".`)
            }else if(change.action === 'update'){
                console.log(`Property "${key}" was updated. New value: "${newMap.get(key)}". Previous value: "${change.oldValue}".`)
                let rootComponentJSON = newMap.get(key)
                // 服务器端格式的Component
                // 即：children被手动置空，信息保存在childrenJSON中
                let rootComponentServerSide = JSON.parse(rootComponentJSON)
                if(!(rootComponentServerSide.usedBy === '__none__' ||
                rootComponentServerSide.usedBy === application.$store.state.user.id)){
                    // 如果更新后的组件状态中，usedBy非空并且不是自己，就先将组件上锁
                    lockComponents(application, rootComponentServerSide.id)
                }


            }else if(change.action === 'delete'){
                console.log(`Property "${key}" was deleted. New value: undefined. Previous value: "${change.oldValue}".`)
            }
        })
    })

    // eslint-disable-next-line no-unreachable
    sharedDocMap.set(file_id, collaboratePrototypeConfig)

    return collaboratePrototypeConfig
}

/**
 * 给定当前用户选择的元素**对应的根元素**，更新实时文档中的信息。
 * 本函数应当在用户选中组件时调用。
 * @param application DesignApp应用
 * @param file_id 页面对应的文件id
 * @param component 根组件。
 * @returns {number}
 */

export function updateCollaborateRootComponent(application, file_id, component){
    if(sharedDocMap.get(file_id)){
        console.log("Find existing doc")
        /**
         * 返回的是一串可以用JSON.parse处理的字符串。
         * @type {[]|string}
         */
        let componentJSON = parseControls([component], 1)
        let collaborateConfig = sharedDocMap.get(file_id)
        let collaborateMap = collaborateConfig.map
        collaborateMap.set(component.id, componentJSON)
        console.log(componentJSON)
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
