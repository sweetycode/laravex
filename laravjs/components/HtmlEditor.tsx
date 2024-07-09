import { useEffect, useRef } from "preact/hooks";
import _ from "../util/dash";
import { dynScript, dynStyle } from '../util/dom';

export default function HtmlEditor({value, onChange}) {
    const editorContainer = useRef(null)
    const toolbarContainer = useRef(null)
    const editor = useRef(null)
    const _lastValue = useRef(value)
    useEffect(() => {
        dynStyle('https://unpkg.com/@wangeditor/editor@latest/dist/css/style.css')
        dynScript('https://unpkg.com/@wangeditor/editor@latest/dist/index.js').then(() => {
            const uniqueId = _.autoInc();
            const editorId = `editor-${uniqueId}`
            const toolbarId = `toolbar-${uniqueId}`
            editorContainer.current.id = editorId
            toolbarContainer.current.id = toolbarId

            const onChangeWrapper = onChange == null? undefined: _.debounce((editor) => {
                const html = editor.getHtml()
                const newValue = html === '<p><br></p>'? '': html
                if (newValue != _lastValue.current) {
                    onChange(_lastValue.current = newValue)
                }
            }, 700)

            const {createEditor, createToolbar} = window.wangEditor
            const editorConfig = {
                placeholder: 'Type here...',
                onChange: onChangeWrapper,
                autoFocus: false,
            }

            editor.current = createEditor({
                selector: '#' + editorId,
                html: value ? value: '<p><br></p>',
                config: editorConfig,
                mode: 'default',
            })

            const toolbar = createToolbar({
                editor: editor.current,
                selector: '#' + toolbarId,
                config: {},
                mode: 'simple'
            })

            return () => {
                if (editor.current) {
                    editor.current.destroy()
                    editor.current = null
                }
            }
        })
    }, [])

    return <div className="border rounded">
        <div ref={toolbarContainer} class="border-b"></div>
        <div ref={editorContainer} className="min-h-40"></div>
    </div>
}
