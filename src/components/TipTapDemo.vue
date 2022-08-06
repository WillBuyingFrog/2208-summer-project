<template>
  <font-awesome-icon icon="fa-solid fa-bold" />
  <editor-content :editor="editor" />
</template>

<script>

import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import { HocuspocusProvider } from '@hocuspocus/provider'


const provider = new HocuspocusProvider({
  url: 'ws://127.0.0.1:1234',
  name: 'example-document',
})


export default {
  name: "TipTapDemo",
  components: {
    EditorContent,
  },
  data() {
    return {
      editor: null
    }
  },

  mounted() {
    this.editor = new Editor({
      extensions: [
        StarterKit.configure({
          // The Collaboration extension comes with its own history handling
          history: false,
        }),
        // Register the document with Tiptap
        Collaboration.configure({
          document: provider.document,
        }),
        CollaborationCursor.configure({
          provider: provider,
          user: {
            name: 'Cyndi Lauper',
            color: '#f783ac',
          },
        }),
      ]
    })
  },

  beforeUnmount() {
    this.editor.destroy()
  },
}
</script>

<style scoped>

</style>
