<template>
  <div class="editor" v-if="editor">
    <menu-bar class="editor__header" :editor="editor" />
    <editor-content class="editor__content" :editor="editor" id="editor"/>
    <div class="editor__footer">
      <div :class="`editor__status editor__status--${status}`">
        <template v-if="status === 'connected'">
          {{ editor.storage.collaborationCursor.users.length }} 位用户正在协同编辑 {{ this.fileName }}
        </template>
        <template v-else>
          offline
        </template>
      </div>
      <div class="editor__name">
        <button @click="setTemplate()">
          点击我保存模板（模板名称等可以直接到数据库里调）
        </button>
        <button>
          {{ currentUser.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { HocuspocusProvider } from '@hocuspocus/provider'
import CharacterCount from '@tiptap/extension-character-count'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import Highlight from '@tiptap/extension-highlight'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import StarterKit from '@tiptap/starter-kit'
import { Editor, EditorContent } from '@tiptap/vue-3'
import * as Y from 'yjs'
import MenuBar from './modules/TipTapMenuBar.vue'
import TextAlign from '@tiptap/extension-text-align'
import Text from '@tiptap/extension-text'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import Gapcursor from '@tiptap/extension-gapcursor'
import Dropcursor from '@tiptap/extension-dropcursor'
import Image from '@tiptap/extension-image'
//import {LineHeight} from '@tiptap/extension-line-height';
const getRandomElement = list => {
  return list[Math.floor(Math.random() * list.length)]
}

const sharedRoomMap = new Map()
const sharedProviderMap = new Map()

export default {
  components: {
    EditorContent,
    MenuBar,
  },
  props: ['fileId', 'fileName'],
  watch:{
    fileId(oldFileId, newFileId){
      sharedRoomMap.delete(oldFileId)
      sharedProviderMap.delete(oldFileId)
      this.editor.destroy()
      this.provider.destroy()
      console.log("Switch to new file:", newFileId)
      this.createEditorRoom()
    }
  },
  data() {
    return {
      currentUser: {
        name: '加载中……',
        color: this.getRandomColor(),
      },
      provider: null,
      editor: null,
      status: 'connecting',
      room: 'loading',
    }
  },
  mounted() {
    // 从localStorage拿数据
    this.$store.state.file_name = localStorage.getItem('file_name')
    this.$store.state.file_index = localStorage.getItem('file_index')
    this.$store.state.user.name = localStorage.getItem('user_name')
    this.$store.state.user.id = localStorage.getItem('user_id')
    this.$store.state.project_id = localStorage.getItem('project_id')
    this.currentUser.name = this.$store.state.user.name



    // 先新建一个房间
    this.createEditorRoom()

  },
  methods: {
    createEditorRoom(){
      // 房间号就是文件id
      this.room = this.$store.state.file_id

      const ydoc = new Y.Doc()
      const yProvider = new HocuspocusProvider({
        url: 'ws://49.232.135.90:7370',
        name: this.fileId,
        document: ydoc,
      })
      yProvider.on('status', event => {
        this.status = event.status
      })
      this.provider = yProvider

      let newEditor = new Editor({
        extensions: [
          StarterKit.configure({
            history: false,
          }),
          Highlight,
          TaskList,
          TaskItem,
          Collaboration.configure({
            document: ydoc,
          }),
          CollaborationCursor.configure({
            provider: this.provider,
            user: this.currentUser,
          }),
          CharacterCount.configure({
            limit: 10000,
          }),
          Text,
          TextAlign.configure({
            types: ['heading', 'paragraph'],
            alignments: ['left', 'center', 'right', 'justify'],
            defaultAlignment: 'left',
          }),
          TextStyle,
          Color,
          Gapcursor,
          Table.configure({
            resizable: true,
            HTMLAttributes: {
              class: 'my-custom-class',
            },
          }),
          TableRow,
          TableHeader,
          TableCell,
          Image,
          Dropcursor,
        ],
      })
      this.editor = newEditor
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser))
      sharedRoomMap.set(this.fileId, newEditor)
      sharedProviderMap.set(this.fileId, yProvider)
    },
    getRandomColor() {
      return getRandomElement([
        '#958DF1',
        '#F98181',
        '#FBBC88',
        '#FAF594',
        '#70CFF8',
        '#94FADB',
        '#B9F18D',
      ])
    },
    setTemplate(){
      let templateName = prompt("给定一个模板名称：")
      this.$http
      .post('/template/DocNew', {
        template_name: templateName.toString(),
        content: this.editor.getHTML(),
        type: "0"
      })
      .then(res => {
        switch (res.data.code){
          case 200:
            alert('成功创建文档模板。')
        }
      })
    }
  },
  beforeUnmount() {
    this.editor.destroy()
    this.provider.destroy()
  },
}
</script>

<style lang="scss">
.editor {
  display: flex;
  flex-direction: column;
  height: 95%;
  color: #0D0D0D;
  background-color: rgba(250, 250, 250, 0.6);
  border: 0px solid #0D0D0D;
  border-radius: 0.75rem;
  box-shadow: 3px 3px 10px #bebebe;
  &__header {
    display: flex;
    align-items: center;
    flex: 0 0 auto;
    flex-wrap: wrap;
    padding: 0.25rem;
    border-bottom: 1px solid #0D0D0D;
  }
  &__content {
    text-align: left;
    padding: 1.25rem 1rem;
    flex: 1 1 auto;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  &__footer {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    white-space: nowrap;
    border-top: 1px solid #0D0D0D;
    font-size: 12px;
    font-weight: 600;
    color: #0D0D0D;
    white-space: nowrap;
    padding: 0.25rem 0.75rem;
  }
  /* Some information about the status */
  &__status {
    display: flex;
    align-items: center;
    border-radius: 5px;
    &::before {
      content: ' ';
      flex: 0 0 auto;
      display: inline-block;
      width: 0.5rem;
      height: 0.5rem;
      background: rgba(#0D0D0D, 0.5);
      border-radius: 50%;
      margin-right: 0.5rem;
    }
    &--connecting::before {
      background: #616161;
    }
    &--connected::before {
      background: #B9F18D;
    }
  }
  &__name {
    button {
      background: none;
      border: none;
      font: inherit;
      font-size: 12px;
      font-weight: 600;
      color: #0D0D0D;
      border-radius: 0.4rem;
      padding: 0.25rem 0.5rem;
      &:hover {
        color: #FFF;
        background-color: #0D0D0D;
      }
    }
  }
}
</style>

<style lang="scss">
/* Give a remote user a caret */
.collaboration-cursor__caret {
  position: relative;
  margin-left: -1px;
  margin-right: -1px;
  border-left: 1px solid #0D0D0D;
  border-right: 1px solid #0D0D0D;
  word-break: normal;
  pointer-events: none;
}
/* Render the username above the caret */
.collaboration-cursor__label {
  position: absolute;
  top: -1.4em;
  left: -1px;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  user-select: none;
  color: #0D0D0D;
  padding: 0.1rem 0.3rem;
  border-radius: 3px 3px 3px 0;
  white-space: nowrap;
}
/* Basic editor styles */
.ProseMirror {
  padding-top: 30px;
  padding-bottom: 30px;
  padding-left: 80px;
  padding-right: 80px;
  > * + * {
    margin-top: 0.75em;
  }
  ul,
  ol {
    padding: 0 1rem;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
  }
  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
  }
  pre {
    background: #0D0D0D;
    color: #FFF;
    font-family: 'JetBrainsMono', monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }
  }
  mark {
    background-color: #FAF594;
  }
  img {
    max-width: 100%;
    height: auto;
  }
  hr {
    margin: 1rem 0;
  }
  blockquote {
    padding-left: 1rem;
    border-left: 2px solid rgba(#0D0D0D, 0.1);
  }
  hr {
    border: none;
    border-top: 2px solid rgba(#0D0D0D, 0.1);
    margin: 2rem 0;
  }
  ul[data-type="taskList"] {
    list-style: none;
    padding: 0;
    li {
      display: flex;
      align-items: center;
      > label {
        flex: 0 0 auto;
        margin-right: 0.5rem;
        user-select: none;
      }
      > div {
        flex: 1 1 auto;
      }
    }
  }
  table {
        border-right: 2px solid #aeacac;
        border-bottom: 2px solid #aeacac;
        text-align: center;
    }

    table th {
        border-left: 2px solid #aeacac;
        border-top: 2px solid #aeacac;
    }

    table td {
        border-left: 2px solid #aeacac;
        border-top: 2px solid #aeacac;
    }
  img {
    max-width: 100%;
    height: auto;

    &.ProseMirror-selectednode {
      outline: 3px solid #68CEF8;
    }
  }
}
</style>
