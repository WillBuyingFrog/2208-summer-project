import {parseControls} from "@/views/prototype-design/utils/collaborate";

export function _exportControlsJson(application){
    let result = parseControls(application.$data.controls)
    let fullData = {
        components: result,
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
 * 传入DesignApp，从服务器抓取静态存储的原型设计画布信息。
 * @param application DesignApp应用。其中应该有恰当配置的$store.state和file_id data property。
 * @private
 */
export function _loadCanvasByPageId(application){
    application.$http({
        method: 'POST',
        url: '/file/json/get',
        params: {
            file_id: application.file_id
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
