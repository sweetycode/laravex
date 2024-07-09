import { useMemo, useState } from "preact/hooks"
import { httpPost, httpPut, useHttpState } from "../util/requests"
import { useLocation } from "wouter-preact"
import { Data, Field, FieldName, FieldValue, shouldRenderField, ViewType } from "./Fields"
import { usePageTitle } from "../util/hooks"

export function EditView({id, resource, fields}: {id: number|string, resource: string, fields: Field[]}) {
    usePageTitle(`edit ${id}-${resource}-Admin`)
    const view = ViewType.EDIT
    const editFields = useMemo(() => {
        return fields.filter(field => shouldRenderField({view, field}))
    }, fields)
    const data = useHttpState(`/admin/api/${resource}/${id}`)
    return <Form view={view} resource={resource} data={data} fields={editFields}/>
}

export function CreateView({resource, fields}: {resource: string, fields: Field[]}) {
    usePageTitle(`create ${resource}-Admin`)
    const view = ViewType.CREATE
    const createFields = useMemo(() => {
        return fields.filter(field => shouldRenderField({view, field}))
    }, fields)

    return <Form view={view} resource={resource} data={null} fields={createFields}/>
}

function Form({view, data, resource, fields}: {view: ViewType, data: Data|null, resource: string, fields: Field[]}) {
    const [editing, _setEditing] = useState({})
    const [location, navigate] = useLocation()
    function setEditing(kvs: Object) {
        _setEditing(editing => ({...editing, ...kvs}))
    }
    function clearEditing() {
        _setEditing(editing => ({}))
    }

    function getValue(name: string): string {
        const editingValue = editing[name]
        if (editingValue != null) {
            return editingValue
        }
        const postValue = data != null? data[name]: null
        if (postValue) {
            return postValue
        }
        return ''
    }

    function handleSubmit() {
        if (Object.keys(editing).length === 0) {
            return
        }

        if (view === ViewType.CREATE) {
            httpPost(`/admin/api/${resource}`, editing).then(({id}) => {
                navigate(`/${resource}/${id}`)
            })
        } else {
            httpPut(`/admin/api/${resource}/${data.id}`, editing).then(({id}) => {
                navigate(`/${resource}/${id}`)
            })
        }
    }

    return <>
        <table className="w-full">
            {fields.map(field => <tr>
                <td className="p-2 uppercase text-zinc-500 text-right w-0"><FieldName view={view} field={field}/>:</td>
                <td className="p-2"><FieldValue view={view} resource={resource} field={field} data={data?? {}} editing={editing} onChange={setEditing}/></td>
            </tr>)}
        </table>
        <div className="text-right py-2 space-x-2">
            <a onClick={clearEditing} className="text-white bg-gray-500 hover:bg-gray-600 px-2 py-1 rounded cursor-pointer">Reset</a>
            <a onClick={handleSubmit} className="text-white bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded cursor-pointer">Submit</a>
        </div>
        <div className="p-4 border rounded bg-zinc-100 my-4">
            <pre>{JSON.stringify(editing, null, 2)}</pre>
        </div>
    </>
}

