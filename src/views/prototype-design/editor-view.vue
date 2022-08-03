<template>
  <div :class="this.parentId ? 'ds-editor nest-editor' : 'ds-editor root-editor'"
       :id="this.parentId ? 'nested-editor' + this.parentId : 'root-editor-view'">
    <div class="ds-editor-canvas" ref="editor">
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

import PluginDrop from "@/views/prototype-design/plugins/plugin-drop"
import CellWrapper from "@/views/prototype-design/cell-wrapper"

export default {
  name: "editor-view",
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
