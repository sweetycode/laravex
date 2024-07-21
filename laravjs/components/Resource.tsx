import _ from "../util/dash";
import { httpPost, httpPut } from "../util/requests"
import { NamedField, ViewType } from './Fields';


export type ResourceAction = 'list'|'get'|'update'|'store'|'delete'

export interface Resource {
    name: string // posts, tags, categories, etc...
    fields: NamedField[]
    handleSubmit?: HandleSubmitFunc
}

export interface HandleSubmitOptions {
    view: ViewType
    editing: object
    id?: number
    resource: Resource
    navigate: (string) => any
}

export type HandleSubmitFunc = (options: HandleSubmitOptions) => void

export const defaultHandleSubmit: HandleSubmitFunc = ({view, editing, id, resource, navigate}) => {
    if (view === 'create') {
        httpPost(`/admin/api/${resource.name}`, editing).then(({id}) => {
            navigate(`/${resource.name}/${id}`)
        })
    } else {
        httpPut(`/admin/api/${resource.name}/${id}`, editing).then(({id}) => {
            navigate(`/${resource.name}/${id}`)
        })
    }
}
