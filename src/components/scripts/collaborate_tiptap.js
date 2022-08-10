

import { HocuspocusProvider } from '@hocuspocus/provider'
import CharacterCount from '@tiptap/extension-character-count'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import Highlight from '@tiptap/extension-highlight'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import StarterKit from '@tiptap/starter-kit'
import { Editor } from '@tiptap/vue-3'
import * as Y from 'yjs'
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

export async function tiptap_createFromTemplate(application, file_id, template_id){

    let templateContent = null

    // eslint-disable-next-line no-unused-vars
    let temp = await application.$http
        .post('/template/getDocTemplate', {
            template_id: template_id.toString()
        })
        .then(res => {
            switch(res.data.code){
                case 200:
                    templateContent = res.data.data.content
                    console.log("Successfully get content:", templateContent)
            }
        })

    const ydoc = new Y.Doc()
    const yProvider = new HocuspocusProvider({
        url: 'ws://49.232.135.90:7370',
        name: file_id,
        document: ydoc,
    })
    // eslint-disable-next-line no-unused-vars
    let temp_status = null
    yProvider.on('status', event => {
        temp_status = event.status
    })

    // eslint-disable-next-line no-unused-vars
    let newEditor = new Editor({
        content: templateContent,
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
                provider: yProvider,
                user: 'MoShu'
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

    setTimeout(() => {
        newEditor.destroy()
        yProvider.destroy()
    }, 6000)
}
