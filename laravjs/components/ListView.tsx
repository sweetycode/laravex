import { useMemo } from 'preact/hooks';
import { useHttpState } from '../util/requests';
import LoadingPanel from "./LoadingPanel";
import { Link } from 'wouter-preact';
import { FieldComponent, ViewType } from './Fields';
import { usePageTitle } from '../util/hooks';
import { Resource } from './Resource';

const view: ViewType = 'list'

export default function ListView({resource}: {resource: Resource}) {
    const data = useHttpState(`/admin/api/${resource.name}`)
    usePageTitle(`${resource.name}-Admin`)

    if (data == null) {
        return <LoadingPanel/>
    }

    const showFields = useMemo(() => resource.fields.filter(f => f.isVisible({view})), [])

    const rows = data.data
    return <>
        <div className="text-right my-2">
            <Link className="text-white bg-blue-500 hover:bg-blue-600 rounded px-4 py-2" href={`/${resource.name}/create`}>Create</Link>
        </div>

        <table className="w-full text-medium text-left text-gray-800 rounded-lg">
            <thead className="text-sm text-black uppercase bg-gray-50">
                {showFields.map(field => <th className="px-3 py-2">{field.name}</th>)}
            </thead>
            <tbody>
                {rows.map(data => <tr className="even:bg-gray-50 border-b">
                    {showFields.map(field => <td className="px-3 py-2"><FieldComponent view={view} resource={resource} field={field} data={data}/></td>)}
                </tr>)}
            </tbody>
        </table>
    </>
}
