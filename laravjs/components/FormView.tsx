import { useMemo, useState } from "preact/hooks"
import { httpPost, httpPut, useHttpState } from "../util/requests"
import { useLocation } from "wouter-preact"
import { Data, Field, FieldComponent, NamedField, ViewType } from './Fields';
import { usePageTitle } from "../util/hooks"

export function EditView({id, resource, fields}: {id: number|string, resource: string, fields: Field[]}) {
    usePageTitle(`edit ${id}-${resource}-Admin`)
    const view: ViewType = 'edit'
    const showFields = useMemo(() => fields.filter(field => field.isVisible({view})), [fields])
    const data = useHttpState(`/admin/api/${resource}/${id}`)
    return <Form view={view} resource={resource} data={data} fields={showFields}/>
}

export function CreateView({resource, fields}: {resource: string, fields: Field[]}) {
    usePageTitle(`create ${resource}-Admin`)
    const view: ViewType = 'create'
    const showFields = useMemo(() => fields.filter(field => field.isVisible({view})), [fields])
    return <Form view={view} resource={resource} data={null} fields={showFields}/>
}

function Form({view, data, resource, fields}: {view: ViewType, data: Data|null, resource: string, fields: NamedField[]}) {
    const [editing, _setEditing] = useState({})
    const [_, navigate] = useLocation()
    function setEditing(kvs: Object) {
        _setEditing(editing => ({...editing, ...kvs}))
    }
    function clearEditing() {
        _setEditing(editing => ({}))
    }

    function handleSubmit() {
        if (Object.keys(editing).length === 0) {
            return
        }

        if (view === 'create') {
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
                <td className="p-2 uppercase text-zinc-500 text-right w-0">{field.name}:</td>
                <td className="p-2"><FieldComponent view={view} resource={resource} field={field} data={data?? {}} editing={editing} onChange={setEditing}/></td>
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

