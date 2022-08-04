<template>
  <label for="username">Your username</label>
  <input id="username" type="text" />

  <div id="users"></div>
  <QuillEditor
      theme="snow"
      :modules="modules"
      @ready="(quill) => this.createQuillBinding(quill)"
  />
</template>

<script>

import { defineComponent } from 'vue'

import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import QuillCursors from 'quill-cursors'

import {handleQuillBinding} from "@/components/scripts/collaborate-text";

export default defineComponent({
  data(){
    return {
      isReady: false
    }
  },
  components: {
    QuillEditor,
  },
  methods: {
    createQuillBinding(quill){
      console.log(quill.getModule('cursors'))
      handleQuillBinding(quill)
      this.isReady = true
    }
  },
  setup: () => {
    const modules = {
      name: 'cursors',
      module: QuillCursors,
      options: {cursors: true}
    }
    return {modules}
  }
})
</script>

<style scoped>

</style>
