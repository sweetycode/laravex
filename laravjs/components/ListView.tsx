import { useMemo } from 'preact/hooks';
import { useHttpState } from '../util/requests';
import LoadingPanel from "./LoadingPanel";
import { Link } from 'wouter-preact';
import { FieldComponent, NamedField, ViewType } from './Fields';
import { usePageTitle } from '../util/hooks';

const view: ViewType = 'list'

export default function ListView({resource, fields} :{resource: string, fields: NamedField[]}) {
    const data = useHttpState(`/admin/api/${resource}`)
    usePageTitle(`${resource}-Admin`)

    if (data == null) {
        return <LoadingPanel/>
    }

    const showFields = useMemo(() => fields.filter(f => f.isVisible({view})), [fields])

    const rows = data.data
    return <>
        <div className="text-right my-2">
            <Link className="text-white bg-blue-500 hover:bg-blue-600 rounded p-1" href={`/${resource}/create`}>Create</Link>
        </div>

        <table className="w-full">
            <thead>
                {showFields.map(field => <th className="border p-2 bg-zinc-200">{field.name}</th>)}
            </thead>
            <tbody>
                {rows.map(data => <tr>
                    {showFields.map(field => <td className="p-1 border"><FieldComponent view={view} resource={resource} field={field} data={data}/></td>)}
                </tr>)}
            </tbody>
        </table>
    </>
}
