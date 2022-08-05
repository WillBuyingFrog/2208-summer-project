<script>

import eventBus from "@/views/prototype-design/utils/eventBus";
import {EVENT_COMPONENT_ADD} from "@/views/prototype-design/event-enum";


export default {
  name: "plugin-drop",
  props: {
    length: Number,
    parentId: String,
  },
  inject: ['editorDOM'],
  methods: {
    handleDropOver(e) {
      e.preventDefault()
      e.stopPropagation()
    },
    getImageDataUrl(file) {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          resolve(e.target.result)
        }
        reader.readAsDataURL(file)
      })
    },
    async handleDrop(e) {
      e.preventDefault()
      e.stopPropagation()
      // file drop
      let files = e.dataTransfer.files
      let addComponents = []
      let comstr = ''
      // 该功能给所有编辑视图提供，包括嵌套的编辑视图。
      // App.vue中添加到<EditorView></EditorView> 的插件仅提供给应用的顶层编辑视图
      let rect = this.editorDOM.value.getBoundingClientRect()
      console.log(rect)
      let coords = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
      console.log(coords)
      if (files.length > 0) {
        for (let index = 0; index < files.length; index++) {
          const element = files[index]
          const data = await this.getImageDataUrl(element)
          addComponents.push({
            type: 'img',
            url: data,
            ...coords,
            width: 150,
            height: 100,
          })
        }
      } else if ((comstr = e.dataTransfer.getData('text/component'))) {
        let com = JSON.parse(comstr)
        com = { ...com, ...coords }

        addComponents.push(com)
      }
      eventBus.$emit(EVENT_COMPONENT_ADD, { components: addComponents, parentId: this.parentId })
    },
  },
  mounted(){
    let element = this.editorDOM.value
    console.log(element)
    element.addEventListener('dragover', this.handleDropOver, false)
    element.addEventListener('drop', this.handleDrop, false)
  },
  render(){
    if (this.length > 0) return null
    return (
        <div class="guide">
          <div>拖拽左侧组件或是本地图片到画布上以开始设计原型</div>
        </div>
    )
  }
}
</script>

<style scoped>
.guide {
  left: 50%;
  top: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
  color: #999;
  line-height: 2;
  font-size: 16px;
  font-weight: 300;
}
</style>
