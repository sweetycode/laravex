import { useEffect, useRef } from "preact/hooks";
import { dynScript } from "../util/dom";
import _ from "../util/dash";

export default function MonacoEditor({value='', language='txt', fontSize=18, onChange}: {
    value: string,
    language: string,
    fontSize: number,
    onChange: (newValue: string) => void,
}) {
    const containerRef = useRef()
    const editorRef = useRef()
    const lastValueRef = useRef(value)

    useEffect(() => {
        dynScript('https://cdn.jsdelivr.net/npm/monaco-editor@0.50.0/min/vs/loader.js', () => {
            const r = (window as any).require as any
            r.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.50.0/min/vs' }})
            return new Promise(resolve => {
                r(['vs/editor/editor.main'], () => resolve(window.monaco))
            })
        }).then(monoco => {
            editorRef.current = monoco.editor.create(containerRef.current, {
                automaticLayout: true,
                fontSize,
                language,
                value,
                wordWrap: 'on',
                lineNumbersMinChars: 3,
                minimap: {enabled: false},
            });
            if (onChange) {
                editorRef.current.getModel().onDidChangeContent(_.debounce(() => {
                    const newValue = editorRef.current.getModel().getValue()
                    if (newValue != lastValueRef.current) {
                        onChange(lastValueRef.current = newValue)
                    }
                }, 700))
            }
        })
        return () => {
            if (editorRef.current) {
                editorRef.current.getModel().dispose()
                editorRef.current.dispose()
            }
        }
    }, [])

    return <div ref={containerRef} className="border rounded h-96"></div>
}
