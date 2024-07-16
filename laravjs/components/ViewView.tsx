import { usePageTitle } from "../util/hooks";
import { useHttpState } from "../util/requests";
import { FieldComponent, NamedField, ViewType } from "./Fields";
import LoadingPanel from "./LoadingPanel";

const view: ViewType = 'view'

export default function ViewView({id, resource, fields}: {id: number|string, resource: string, fields: NamedField[]}) {
    usePageTitle(`${id}-${resource}-Admin`)
    const data = useHttpState(`/admin/api/${resource}/${id}`)
    if (data == null) {
        return <LoadingPanel/>
    }

    return <>
        <table>
            {fields.map(field => <tr>
                <td className="p-2 uppercase text-zinc-500 text-right">{field.name}:</td>
                <td className="p-2"><FieldComponent view={view} resource={resource} field={field} data={data} /></td>
            </tr>)}
        </table>
    </>
}
