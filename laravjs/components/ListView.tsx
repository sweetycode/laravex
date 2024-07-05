import { useMemo } from 'preact/hooks';
import { useHttpState } from '../util/requests';
import LoadingPanel from "./LoadingPanel";
import { Link } from 'wouter-preact';
import { Field, FieldName, FieldValue, shouldRenderField, ViewType } from './Fields';

const view = ViewType.LIST

export default function ListView({resource, fields} :{resource: string, fields: Field[]}) {
    const data = useHttpState(`/admin/api/${resource}`)

    if (data == null) {
        return <LoadingPanel/>
    }

    const listFields = useMemo(() => {
        return fields.filter(field => shouldRenderField({view, field}))
    }, [fields])
    console.log({listFields})

    const rows = data.data
    return <>
        <div className="text-right my-2">
            <Link className="text-white bg-blue-500 hover:bg-blue-600 rounded p-1" href={`/${resource}/create`}>Create</Link>
        </div>

        <table className="w-full">
            <thead>
                {listFields.map(field => <th className="border p-2 bg-zinc-200"><FieldName view={view} field={field}/></th>)}
            </thead>
            <tbody>
                {rows.map(data => <tr>
                    {listFields.map(field => <td className="p-1 border"><FieldValue view={view} resource={resource} field={field} data={data}/></td>)}
                </tr>)}
            </tbody>
        </table>
    </>
}
