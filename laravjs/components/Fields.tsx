import { h } from "preact"
import { BelongsToSelect, TextArea, TextInput } from "./FormControls"
import { IconEdit, IconEye, IconInfo } from "../util/icons"
import HtmlEditor from "./HtmlEditor"
import { Link } from "wouter-preact"
import _ from '../util/dash';

export enum ViewType {
    LIST = 1<<0,
    VIEW = 1<<1,
    CREATE = 1<<2,
    EDIT = 1<<3,
}



export type Field = keyof typeof fieldsComponentMapping
export type Data = {[key: string]: any}


export function shouldRenderField({view, field}: {view: ViewType, field: Field}): boolean {
    switch (field) {
        case 'id':
            return view != ViewType.CREATE
        case 'name':
        case 'slug':
        case 'pic':
        case 'category':
        case 'tags':
            return true
        case 'created_at':
        case 'updated_at':
            return view === ViewType.LIST || view === ViewType.VIEW
        case 'intro':
        case 'html_body':
        case 'markdown':
            return view != ViewType.LIST
    }
}

export function FieldName({view, field}: {view: ViewType, field: Field}): any {
    return field
}

const fieldsComponentMapping = {
    id: IdField,
    name: StringField,
    slug: StringField,
    pic: ImageField,
    category: BelongsToField,
    tags: BelongsToManyField,
    created_at: AutoTimestampField,
    updated_at: AutoTimestampField,
    intro: TextField,
    html_body: HtmlField,
    markdown: MarkdownField,
}

type FieldValueOptions = {view: ViewType, resource: string, field: Field, data: Data, editing: Data, onChange?: (newValue: any) => void}

export function FieldValue(options: FieldValueOptions) {
    return h(fieldsComponentMapping[options.field], options);
}

function onChangeWithKey(onChange: any, field: string) {
    return (newValue) => onChange({[field]: newValue})
}


export function IdField({view, resource, data, field}: FieldValueOptions) {
    const id = data[field]
    switch (view) {
        case ViewType.LIST:
            return <>
                {id}
                <Link href={`/${resource}/${id}`} className="ml-2 hover:text-blue-600"><IconEye/></Link>
                <Link href={`/${resource}/${id}/edit`} className="ml-2 hover:text-blue-600"><IconEdit/></Link>
            </>
        case ViewType.VIEW:
            return <>
                {id}
                <Link href={`/${resource}/${id}/edit`} className="ml-2 hover:text-blue-600"><IconEdit/></Link>
            </>
        default:
            return id
    }
}

export function AutoTimestampField(options: FieldValueOptions): any {
    //todo
}

export function BelongsToField({view, field, data, editing, onChange}: FieldValueOptions): any {
    switch (view) {
        case ViewType.LIST:
        case ViewType.VIEW:
            return data[field] != null ? data[field]['name']: 'n/a'
        default:
            const editingFieldName = `${field}_id`
            return <BelongsToSelect field={field} value={editing[editingFieldName] ?? data[editingFieldName] ?? 0} onChange={onChangeWithKey(onChange, editingFieldName)}/>
    }
}

export function BelongsToManyField({view, field, data, editing, onChange}: FieldValueOptions): any {
    switch (view) {
        case ViewType.LIST:
        case ViewType.VIEW:
            return <>{data[field].map(item => <span className="rounded p-1 bg-gray-200">{item.name}</span>)}</>
        default:
            const editingFieldName = `${field}_name`
            let value = editing[editingFieldName]
            if (value == null) {
                value = (_.get(data, field) ?? []).map(({name}) => name).join(',')
            }
            return <TextInput value={value} onChange={onChangeWithKey(onChange, editingFieldName)} />
    }
}

function StringField({view, resource, field, data, editing, onChange}: FieldValueOptions): any {
    const value = data[field]
    switch (view) {
        case ViewType.LIST:
        case ViewType.VIEW:
            return value
        default:
            return <TextInput value={editing[field] ?? data[field]?? ''} onChange={onChangeWithKey(onChange, field)}/>
    }
}

function ImageField({view, resource, data, field, onChange}: FieldValueOptions): any {
    const value = data[field]
    if (value == null) {
        return 'n/a'
    } else {
        return <IconInfo/> // TODO
    }
}

function TextField({view, resource, field, data, editing={}, onChange}: FieldValueOptions): any {
    const value = data[field]
    switch (view) {
        case ViewType.LIST:
        case ViewType.VIEW:
            return value
        default:
            return <TextArea value={editing[field] ?? data[field] ?? ''} onChange={onChangeWithKey(onChange, field)} />
    }
}

function HtmlField({view, resource, field, data, editing, onChange}: FieldValueOptions) {
    if (view === ViewType.VIEW) {
        return <div dangerouslySetInnerHTML={{__html: data[field] ?? ''}}>

        </div>
    }
    return <HtmlEditor value={editing[field] ?? data[field] ?? ''} onChange={onChangeWithKey(onChange, field)} />
}

function MarkdownField({view, resource, field, data, editing, onChange}: FieldValueOptions): any {
    const value = data[field]
    switch (view) {
        case ViewType.CREATE:
        case ViewType.EDIT:
            return <TextArea value={editing[field] ?? data[field] ?? ''} onChange={onChange}/>
    }
}
