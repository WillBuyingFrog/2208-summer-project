import * as Y from 'yjs'
import { QuillBinding } from 'y-quill'
import { WebsocketProvider } from 'y-websocket'

export function handleQuillBinding(quill){
    const ydoc = new Y.Doc()
    const ytext = ydoc.getText('quill')
    const provider = new WebsocketProvider( 'ws://localhost:1234', 'quill-demo-room', ydoc)
    const awareness = provider.awareness
    const binding = new QuillBinding(ytext, quill, awareness)
    window.addEventListener('blur', () => { quill.blur() })
    const usercolors = [
        '#30bced',
        '#6eeb83',
        '#ffbc42',
        '#ecd444',
        '#ee6352',
        '#9ac2c9',
        '#8acb88',
        '#1be7ff'
    ]
    const myColor = usercolors[Math.floor(Math.random() * usercolors.length)]
    const inputElement = document.querySelector('#username')
    const setUsername = () => {
        awareness.setLocalStateField('user', { name: inputElement.value, color: myColor })
    }
    inputElement.addEventListener('input', setUsername)

    awareness.on('change', () => {
        // Map each awareness state to a dom-string
        const strings = []
        awareness.getStates().forEach(state => {
            // console.log(state)
            if (state.user) {
                strings.push(`<div style="color:${state.user.color};">• ${state.user.name}</div>`)
            }
            document.querySelector('#users').innerHTML = strings.join('')
        })
    })

    // Set a randomly generated username - this is nice for testing
    const DoUsername = require('do_username');
    inputElement.value = DoUsername.generate(15)
    setUsername()

    return {binding, provider}
}
