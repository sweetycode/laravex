import { useEffect, useMemo, useState } from "preact/hooks"
import { useHttpState } from "../util/requests"
import { useLocation } from "wouter-preact"
import { Data, FieldComponent, ViewType } from './Fields';
import { usePageTitle } from "../util/hooks"
import { defaultHandleSubmit, Resource } from "./Resource";
import { codeToHtml } from "shiki";

export function EditView({id, resource}: {id: number|string, resource: Resource}) {
    usePageTitle(`edit ${id}-${resource.name}-Admin`)
    const view: ViewType = 'edit'
    const data = useHttpState(`/admin/api/${resource.name}/${id}`)
    return <Form view={view} resource={resource} data={data}/>
}

export function CreateView({resource}: {resource: Resource}) {
    usePageTitle(`create ${resource}-Admin`)
    const view: ViewType = 'create'
    return <Form view={view} resource={resource} data={null}/>
}

function Form({view, data, resource}: {view: ViewType, data: Data|null, resource: Resource}) {
    const fields = useMemo(() => resource.fields.filter(field => field.isVisible({view})), [])
    const [editing, _setEditing] = useState({})
    const [_, navigate] = useLocation()
    function setEditing(kvs: Object) {
        _setEditing(editing => ({...editing, ...kvs}))
    }
    function clearEditing() {
        _setEditing(_ => ({}))
    }

    function handleSubmit() {
        if (Object.keys(editing).length === 0) {
            return
        }

        var handleSubmit = resource.handleSubmit ?? defaultHandleSubmit
        handleSubmit({
            view,
            editing,
            id: data != null? data.id: null,
            resource,
            navigate,
        })
    }

    return <>
        <table className="w-full">
            {fields.map(field => <tr>
                <td className="py-2 text-zinc-500 text-right w-0 text-sm">{field.name}:</td>
                <td className="py-2 pl-1"><FieldComponent view={view} resource={resource} field={field} data={data?? {}} editing={editing} onChange={setEditing}/></td>
            </tr>)}
        </table>
        <div className="text-right py-2 space-x-2">
            <a onClick={clearEditing} className="text-white bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded cursor-pointer">Reset</a>
            <a onClick={handleSubmit} className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded cursor-pointer">Submit</a>
        </div>
        <JsonView value={editing}/>
    </>
}

function JsonView({value}) {
    const [html, setHtml] = useState('')
    useEffect(() => {
        codeToHtml(JSON.stringify(value, null, 2), {
            lang: 'json', theme: 'light-plus',
            transformers: [{
                pre(node) {
                    this.addClassToHast(node, 'text-wrap')
                }
            }],
        })
        .then(setHtml)
    }, [value])
    return <div className="p-4 border rounded my-4 text-wrap" dangerouslySetInnerHTML={{__html: html}}>
    </div>
}

