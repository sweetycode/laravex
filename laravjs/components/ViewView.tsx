import { usePageTitle } from "../util/hooks";
import { useHttpState } from "../util/requests";
import { Resource } from "./BasicAdminApp";
import { FieldComponent, ViewType } from "./Fields";
import LoadingPanel from "./LoadingPanel";

const view: ViewType = 'view'

export default function ViewView({id, resource}: {id: number|string, resource: Resource}) {
    usePageTitle(`${id}-${resource.name}-Admin`)
    const data = useHttpState(`/admin/api/${resource.name}/${id}`)
    if (data == null) {
        return <LoadingPanel/>
    }

    return <>
        <table>
            {resource.fields.map(field => <tr>
                <td className="p-2 uppercase text-zinc-500 text-right">{field.name}:</td>
                <td className="p-2"><FieldComponent view={view} resource={resource} field={field} data={data} /></td>
            </tr>)}
        </table>
    </>
}
