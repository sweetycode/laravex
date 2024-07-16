import { ComponentChild, h, options } from "preact"
import { BelongsToSelect, CommaTextInput, DateTimeInput, TextArea, TextInput } from "./FormControls"
import { IconEdit, IconEye, IconInfo } from "../util/icons"
import HtmlEditor from "./HtmlEditor"
import { Link } from "wouter-preact"
import _ from '../util/dash';
import AceEditor from "./AceEditor"

export type ViewType = 'list'|'create'|'edit'|'view'

export type Data = {[key: string]: any}

type IsVisibleFunc = ({view}: {view: ViewType}) => boolean
type FieldComponent = (options: FieldComponentOptions) => ComponentChild
export interface Field {
    isVisible: IsVisibleFunc,
    component: FieldComponent,
}


export const visibleExceptList: IsVisibleFunc = ({view}) => view != 'list'
export const visibleOnlyInForm: IsVisibleFunc = ({view}) => view == 'edit' || view == 'create'

export interface NamedField extends Field {
    name: string
}

export function toPresetNamedField(name: string): NamedField {
    const presetField = presetFieldsMap[name]
    if (presetField == null) {
        console.error(`encounter unknown field: ${name}`)
    }
    return {...presetField, name}
}

const presetFieldsMap: {[index: string]: Field} = {
    id: {
        isVisible: ({view}) => view != 'create',
        component: IdField,
    },
    name: {
        isVisible: () => true,
        component: StringField,
    },
    slug: {
        isVisible: () => true,
        component: StringField,
    },
    source: {
        isVisible: visibleExceptList,
        component: StringField,
    },
    pic: {
        isVisible: () => true,
        component: ImageField,
    },
    category: {
        isVisible: () => true,
        component: BelongsToField,
    },
    tags: {
        isVisible: () => true,
        component: BelongsToManyField,
    },
    updated_at: {
        isVisible: ({view}) => view === 'list' || view === 'view',
        component: AutoTimestampField,
    },
    created_at: {
        isVisible: ({view}) => view === 'list' || view === 'view',
        component: AutoTimestampField,
    },
    published_at: {
        isVisible: () => true,
        component: TimestampField,
    },
    intro: {
        isVisible: ({view}) => view != 'list',
        component: TextField,
    },
    html_body: {
        isVisible: ({view}) => view != 'list',
        component: HtmlField,
    },
    generated_html_body: {
        isVisible: ({view}) => view != 'list',
        component: HtmlField,
    },
    markdown_body: {
        isVisible: ({view}) => view != 'list',
        component: MarkdownField,
    },
}

export type FieldComponentOptions = {view: ViewType, resource: string, field: NamedField, data: Data, editing: Data, onChange?: (newValue: any) => void}

export function FieldComponent(options: FieldComponentOptions) {
    return h(options.field.component, options)
}


function onChangeWithKey(onChange: any, field: string) {
    return (newValue) => onChange({[field]: newValue})
}


export function IdField({view, resource, data, field}: FieldComponentOptions) {
    const id = data[field.name]
    switch (view) {
        case 'list':
            return <>
                {id}
                <Link href={`/${resource}/${id}`} className="ml-2 hover:text-blue-600"><IconEye/></Link>
                <Link href={`/${resource}/${id}/edit`} className="ml-2 hover:text-blue-600"><IconEdit/></Link>
            </>
        case 'view':
            return <>
                {id}
                <Link href={`/${resource}/${id}/edit`} className="ml-2 hover:text-blue-600"><IconEdit/></Link>
            </>
        default:
            return id
    }
}


export function TimestampField({view, field, data, editing, onChange}: FieldComponentOptions): any {
    switch (view) {
        case 'list':
        case 'view':
            return data[field.name] ?? ''
        default:
            return <DateTimeInput value={editing[field.name]??data[field.name]??''} onChange={onChangeWithKey(onChange, field.name)}/>
    }
}

export function AutoTimestampField(options: FieldComponentOptions): any {
    return 'TODO'
}

export function BelongsToField({view, field, data, editing, onChange}: FieldComponentOptions): any {
    const fieldName = field.name
    switch (view) {
        case 'list':
        case 'view':
            return data[fieldName] != null ? data[fieldName]['name']: 'n/a'
        default:
            const editingFieldName = `${fieldName}_id`
            return <BelongsToSelect fieldName={fieldName} value={editing[editingFieldName] ?? data[editingFieldName] ?? 0} onChange={onChangeWithKey(onChange, editingFieldName)}/>
    }
}

export function BelongsToManyField({view, field, data, editing, onChange}: FieldComponentOptions): any {
    const fieldName = field.name
    switch (view) {
        case 'list':
        case 'view':
            return <>{data[fieldName].map(item => <span className="rounded p-1 bg-gray-200">{item.name}</span>)}</>
        default:
            const editingFieldName = `${fieldName}_name`
            let value = editing[editingFieldName]
            if (value == null) {
                value = (_.get(data, fieldName) ?? []).map(({name}) => name)
            }
            return <CommaTextInput value={value} onChange={onChangeWithKey(onChange, editingFieldName)} />
    }
}

export function StringField({view, resource, field, data, editing, onChange}: FieldComponentOptions): any {
    const fieldName = field.name
    switch (view) {
        case 'list':
        case 'view':
            return data[fieldName]
        default:
            const value = editing[fieldName] ?? data[fieldName]?? ''
            return <TextInput value={value} onChange={onChangeWithKey(onChange, fieldName)}/>
    }
}

export function NumberField({view, resource, field, data, editing, onChange}: FieldComponentOptions): ComponentChild {
    switch (view) {
        case 'list':
        case 'view':
            return data[field.name]
        default:
            const value = editing[field.name] ?? data[field.name] ?? ''
            return <TextInput type="number" value={value} onChange={onChangeWithKey(onChange, field.name)}/>
    }
}

export function ImageField({view, resource, data, field, onChange}: FieldComponentOptions): any {
    const value = data[field.name]
    if (value == null) {
        return 'n/a'
    } else {
        return <IconInfo/> // TODO
    }
}

export function TextField({view, resource, field, data, editing={}, onChange}: FieldComponentOptions): any {
    switch (view) {
        case 'list':
        case 'view':
            return data[field.name]
        default:
            const value = editing[field.name] ?? data[field.name] ?? ''
            return <TextArea value={value} onChange={onChangeWithKey(onChange, field.name)} />
    }
}

export function HtmlField({view, resource, field, data, editing, onChange}: FieldComponentOptions) {
    if (view === 'view') {
        return <div dangerouslySetInnerHTML={{__html: data[field.name] ?? ''}}>

        </div>
    }
    const value = editing[field.name] ?? data[field.name] ?? ''
    return <HtmlEditor value={value} onChange={onChangeWithKey(onChange, field.name)} />
}

export function MarkdownField({view, resource, field, data, editing, onChange}: FieldComponentOptions): any {
    switch (view) {
        case 'create':
        case 'edit':
            return <AceEditor value={editing[field.name] ?? data[field.name] ?? ''} language="markdown" onChange={onChangeWithKey(onChange, field.name)}/>
        default:
            return <pre>{data[field.name]}</pre>
    }
}

export function interceptOnChange(fieldComponent: FieldComponent, onChangeInterceptor: (newValue: any, options: FieldComponentOptions) => void): FieldComponent {
    return (options: FieldComponentOptions) => {
        function onChange(newValue: any) {
            onChangeInterceptor(newValue, options)
        }
        return h(fieldComponent, {...options, onChange})
    }
}
