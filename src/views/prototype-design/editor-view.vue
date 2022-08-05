<template>
  <div :class="this.parentId ? 'ds-editor nest-editor' : 'ds-editor root-editor'"
       :id="this.parentId ? 'nested-editor' + this.parentId : 'root-editor-view'"
       :style="this.parentId ?  this.childCanvasStyle : this.canvasStyle"
  >
    <div ref="editor">
      <CellWrapper v-for="item in value"
                   :item="item"
                   :key="item.id"
                   />
      <slot name="default"></slot>
      <PluginDrop :parentId="this.parentId" :length="this.value.length" />
    </div>
  </div>
</template>


<script>
import {computed} from 'vue'

import eventBus from "@/views/prototype-design/utils/eventBus";
import {EVENT_DESIGNER_RESIZE} from "@/views/prototype-design/event-enum";

import PluginDrop from "@/views/prototype-design/plugins/plugin-drop"
import CellWrapper from "@/views/prototype-design/cell-wrapper"

export default {
  name: "editor-view",
  data(){
    return {
      canvasStyle: {
        width: '100%',
        height: '95%',
        border: '1px solid black',
        marginLeft: '0%',
        marginRight: '0%'
      },
      childCanvasStyle: {
        // 这些style不应该被更改
        width: '100%',
        height: '100%',
        border: 'none'
      }
    }
  },
  components: {
    CellWrapper,
    PluginDrop
  },
  props:{
    value: Array,
    // 由于EditorView可能不只有一个，有的是拖拽生成的div，
    // 所以需要parentId记录当前EditorView所属的父元素是谁
    parentId: String,
    parent: Object
  },
  provide(){
    return {
      // Vue2 -> Vue3
      // 在子组件中使用inject: ['editorDOM']
      editorDOM: computed(() => this.$refs.editor)
    }
  },
  methods: {
      // 由于Vue3特性，原版本中唯一的methods已空
    // 增加功能：设置整个画布的大小
    handleResize({newWidth, newHeight, margins}){
      console.log(newWidth, newHeight, margins)
      this.canvasStyle.width = newWidth
      this.canvasStyle.height = newHeight
      console.log("Received margins:", margins)
      this.canvasStyle.marginLeft = margins
      this.canvasStyle.marginRight = margins
    }
  },
  created(){
    eventBus.$on(EVENT_DESIGNER_RESIZE, this.handleResize)
  }
}
</script>

<style scoped>

.ds-editor-canvas {
  width: 100%;
  height: 100%;
}

.root-editor > .ds-editor-canvas {
  transform: scale(1);
  transform-origin: top left;
}
</style>
