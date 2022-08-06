import {parseControls} from "@/views/prototype-design/utils/collaborate";

export async function _exportControlsJson(application){
    let result = parseControls(application.$data.controls)
    let fullData = {
        components: result,
        // TODO 从application中保存页面
        width: '1200px',
        height: '900px',
    }
    result = JSON.stringify(fullData)
    // console.log(result)
    application.$http
        // 与后端沟通过，不需要序列化
        .post('/file/collaborate/update', {
            file_id: application.file_id,
            file_name: application.file_name,
            content: result
        })
        .then(res => {
            console.log(res)
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
        console.log("hello1")
        application.$http
            .post('/file/page/get', {
                prototype_id: application.file_id
            })
            .then(res => {
                console.log("hello2")
                let allPages = res.data.data
                let minIndex = 100000
                allPages.map((item) => {
                    console.log("Iterating through ", item.page_index)
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
                _loadCanvasByPageId(application, cur.page_file_id)
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
