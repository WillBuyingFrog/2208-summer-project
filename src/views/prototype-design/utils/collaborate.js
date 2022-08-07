import * as Y from 'yjs'
import { WebsocketProvider } from "y-websocket";
import {findComponent} from "@/views/prototype-design/utils/index";


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

export function disableComponent(application, componentId){
    console.log(application)
    console.log(componentId)
}

export function enableComponent(application, componentId){
    console.log(application)
    console.log(componentId)
}


export const sharedDocMap = new Map()

export function getCollaboratePrototype(file_id){

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

    const newMap = new Y.Map()
    collaboratePrototypeConfig.map = newMap

    sharedDocMap.set(file_id, collaboratePrototypeConfig)

    return collaboratePrototypeConfig
}

/**
 * 给定当前用户选择的元素**对应的根元素**，更新实时文档中的信息
 * @param application DesignApp应用
 * @param file_id 页面对应的文件id
 * @param component 根组件。
 * @returns {number}
 */

export function updateCollaborateRootComponent(application, file_id, component){
    if(sharedDocMap.get(file_id)){
        console.log("Find existing doc")
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
