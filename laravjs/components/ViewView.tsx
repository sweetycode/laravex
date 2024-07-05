import { useHttpState } from "../util/requests";
import { Field, FieldName, FieldValue, ViewType } from "./Fields";
import LoadingPanel from "./LoadingPanel";

const view = ViewType.VIEW

export default function ViewView({id, resource, fields}: {id: number|string, resource: string, fields: Field[]}) {
    const data = useHttpState(`/admin/api/${resource}/${id}`)
    if (data == null) {
        return <LoadingPanel/>
    }

    return <>
        <table>
            {fields.map(field => <tr>
                <td className="p-2 uppercase text-zinc-500 text-right"><FieldName view={view} field={field}/>:</td>
                <td className="p-2"><FieldValue view={view} resource={resource} field={field} data={data} /></td>
            </tr>)}
        </table>
    </>
}
