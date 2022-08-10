// eslint-disable-next-line no-unused-vars
import {level_getCollaboratePrototype, level_switchPage} from "@/views/prototype-design/utils/collaborate_level";


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


export const templateContents = new Map()
export const templatePageIndexToName = new Map()

/**
 * 仅在开发环境中使用。
 * 将单页内容导出到templateContents中。
 * @param application
 * @returns {Promise<void>}
 * @private
 */
export function _exportControlsJson(application){
    let currentComponents = parseControls(application.controls)
    templateContents.set(application.currentPage.page_index, currentComponents)
    templatePageIndexToName.set(application.currentPage.page_index, application.currentPage.page_name)
    alert("已经保存好页面index为 " + application.currentPage.page_index + " 的数据，请记得导出到服务器")
}

/**
 * 仅在开发环境中使用。
 * 将当前存储的模板内容传输到后端数据库中。
 * @param application
 * @private
 */
export function _exportTemplateToBackend(application){

    const pages = []

    function processPages(value, key) {
        let page_name = templatePageIndexToName.get(key)
        let page_index = key
        let components = JSON.stringify(value)
        let width = application.currentPage.width
        let height = application.currentPage.height
        pages.push({
            page_index: page_index,
            page_name: page_name,
            components: components,
            width: width,
            height: height
        })
    }
    templateContents.forEach(processPages)
    const parsedPages = JSON.stringify(pages)
    application.$http
        .post('/template/ProtoNew', {
            template_name: "测试模板",
            template_id: "2",
            template_page_count: pages.length,
            template_height: application.currentPage.height.toString(),
            template_width: application.currentPage.width.toString(),
            pages: parsedPages
        })
        .then(res => {
            switch (res.data.code){
                case 200:
                    alert('成功创建模板。')
            }
        })
}

/**
 * 只在启动时使用！！
 * 传入DesignApp，从服务器抓取静态存储的所有原型设计画布信息。
 * @param application DesignApp应用。其中应该有恰当配置的$store.state和file_id data property。
 * @private
 */
export async function _loadCanvasInit(application){
    // 我们默认file_id对应的是这个原型设计对应的id。
    // 拿到原型设计对应的所有文件id，然后默认取第一个页面（多页面是远期功能）

    let IS_MULTIPAGE_DEMO = true

    let cur = null

    if(IS_MULTIPAGE_DEMO){
        application.$http
            .post('/file/page/get', {
                prototype_id: application.file_id
            })
            .then(res => {
                let allPages = res.data.data
                let minIndex = 100000
                allPages.map((item) => {
                    // console.log("Iterating through ", item.page_index)
                    if(minIndex > item.page_index){
                        minIndex = item.page_index
                        cur = item
                        console.log(cur)
                    }
                    application.pages.push(item)
                })
            })
            .then(() => {
                application.currentPage = cur
                // 新建一个当前页面对应的协作服务器
                // getCollaboratePrototype函数会无条件用远端更新的版本覆盖现在加载的版本
                // getCollaboratePrototype(application, cur.page_id)
                _loadCanvasByPageId(application, cur.page_id)
            })
    }else{
        console.log("You shouldn't see this.")
    }

}

export async function _loadCanvasByPageId(application, pageId){
    application.$http({
        method: 'POST',
        url: '/file/json/get',
        params: {
            file_id: pageId
        }
    })
        .then(res => {
            switch (res.data.code){
                case 200:
                    application.parseComponentJSON({componentJSON: res.data.data.content,
                        parentId: -1})
                // console.log(this.controls)
                // 仅调试时打开
                // this.setControls([])
                // this.clearCurrentComponent()
            }
        })

}

/**
 * 只在Design App启动时调用！！
 * levelDB版本。获取所有页面，并自动获取index最小的页面的yDoc实例。
 * yDoc实例中的yMap会自动从服务器获取所有被保存的组件。
 * @param application
 * @private
 */
export function _level_loadCanvasInit(application){
    let cur = null
    application.$http
        .post('/file/page/get', {
            prototype_id: application.$store.state.file_id
        })
        .then(res => {
            let allPages = res.data.data
            let minIndex = 100000
            allPages.map((item) => {
                // console.log("Iterating through ", item.page_index)
                if(minIndex > item.page_index){
                    minIndex = item.page_index
                    cur = item
                    console.log(cur)
                }
                application.pages.push(item)
            })
        })
        .then(() => {
            application.currentPage = cur
            // 新建一个当前页面对应的协作文档（yDoc）实例
            level_getCollaboratePrototype(application, cur.page_id)
        })
}
