<template>
  <QuillEditor theme="snow" @ready="(quill) => this.createQuillBinding(quill)" />
</template>

<script>

import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

import * as Y from 'yjs'
import { QuillBinding } from 'y-quill'
import { WebsocketProvider } from 'y-websocket'


export default {
  name: "QuillTest",
  data(){
    return {
      collaborate: {
        quill: null,
        ydoc: null,
        ytext: null,
        binding: null,
        provider: null,
      },
      isReady: false
    }
  },
  components: {
    QuillEditor
  },
  methods: {
    createQuillBinding(quill){
      this.collaborate.quill = quill;
      this.collaborate.ydoc = new Y.Doc()
      this.collaborate.ytext = this.collaborate.ydoc.getText('quill')
      this.collaborate.binding = new QuillBinding(this.collaborate.ytext, quill)
      this.collaborate.provider = new WebsocketProvider('ws://localhost:1234',
          'quill-demo-room', this.collaborate.ydoc)
      window.addEventListener('blur', () => { quill.blur() })
      this.isReady = true;
    }
  }
}
</script>

<style scoped>

</style>
