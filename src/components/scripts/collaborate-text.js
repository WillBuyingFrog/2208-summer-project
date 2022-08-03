import * as Y from 'yjs'
import { QuillBinding } from 'y-quill'
import { WebsocketProvider } from 'y-websocket'

export function handleQuillBinding(quill){
    const ydoc = new Y.Doc()
    const ytext = ydoc.getText('quill')
    const binding = new QuillBinding(ytext, quill)
    const provider = new WebsocketProvider( 'ws://localhost:1234', 'quill-demo-room', ydoc)
    return {binding, provider}
}
