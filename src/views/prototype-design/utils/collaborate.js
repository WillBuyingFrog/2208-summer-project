import * as Y from 'yjs'
import { WebsocketProvider } from "y-websocket";


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
 * 协作编辑 export函数
 */

export var collaboratePrototypeConfig = {
    doc: null,
    provider: null,
    awareness: null,
    map: null,

}

export const sharedDocMap = new Map()

export function getCollaboratePrototype(file_id){



    const newDoc = new Y.Doc()
    collaboratePrototypeConfig.doc = newDoc
    const provider = new WebsocketProvider(
        "wss://demos.yjs.dev",
        file_id,  // 房间号即为当前的页面id（页面隶属于某个原型设计，但我们不关心）
        newDoc
    )
    collaboratePrototypeConfig.provider = provider

    const newMap = new Y.Map()
    collaboratePrototypeConfig.map = newMap
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
