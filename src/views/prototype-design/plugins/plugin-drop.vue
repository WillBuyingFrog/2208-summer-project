<script>

import eventBus from "@/views/prototype-design/utils/eventBus";
import {EVENT_COMPONENT_ADD} from "@/views/prototype-design/event-enum";


export default {
  name: "plugin-drop",
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
      console.log("Hello!")
      e.preventDefault()
      e.stopPropagation()
      // file drop
      let files = e.dataTransfer.files
      let addComponents = []
      let comstr = ''
      // 该功能给所有编辑视图提供，包括嵌套的编辑视图。
      // App.vue中添加到<EditorView></EditorView> 的插件仅提供给应用的顶层编辑视图
      let rect = this.editorDOM.value.getBoundingClientRect()
      let coords = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
      console.log("Full dataTransfer:")
      console.log(e.dataTransfer)
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
        console.log("Detected text/component!")
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
          <div>拖拽组件或本地图片到此区域开始编辑</div>
          <div>Drag component or local pictures to this area to start editing</div>
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
