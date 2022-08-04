<template>
  <div id="editor" />
</template>

<script>

import Quill from 'quill'
import QuillCursors from 'quill-cursors'

import * as Y from 'yjs'
import { QuillBinding } from 'y-quill'
import {WebsocketProvider} from "y-websocket";

Quill.register('modules/cursors', QuillCursors);


export default {
  name: "QuillTest2",
  data(){
    return {
      idReady: false,
      quill: null,
      binding: null,
      provider: null
    }
  },
  mounted(){
    this.$data.quill = new Quill(document.querySelector('#editor'), {
      modules: {
        cursors: true,
        toolbar: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          ['image', 'code-block']
        ],
        history:{
          userOnly: true
        }
      },
      placeholder: 'Start collaborating...',
      theme: 'snow'
    })
    const ydoc = new Y.Doc()
    const ytext = ydoc.getText('quill')

    this.$data.binding = new QuillBinding(ytext, this.$data.quill)

    this.$data.provider = new WebsocketProvider('ws://localhost:1234',
        'quill-demo-room', ydoc)
  }
}
</script>

<style scoped>

</style>
