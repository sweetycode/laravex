import { useMemo } from "preact/hooks"
import { useHttpState } from "../util/requests"
import _ from "../util/dash"

export function TextInput({value, onChange, type="text"}) {
    return <input type={type} className="px-2 py-1 border rounded min-w-full" value={value} onChange={e => onChange(e.target.value)}/>
}

export function DateTimeInput({value, onChange}) {
    return <input type='datetime-local' className="px-2 py-1 border rounded" value={value} onChange={e => onChange(e.target.value)}/>
}

export function CommaTextInput({value, onChange}) {
    return <TextInput value={value.join(',')} onChange={(newValue) => onChange(newValue.split(','))} />
}

export function TextArea({value, onChange}) {
    return <textarea value={value} onChange={e => onChange(e.target.value)} className="border rounded p-2 w-full"></textarea>
}

export function Select({value, onChange, options}) {
    return <select className="px-2 py-1 border rounded" value={value? value: 0} onChange={e => onChange(e.target.value)}>
        <option value="0">None</option>
        {options.map(({id, name}) => <option value={id}>{name}</option>)}
    </select>
}

export function BelongsToSelect({value, fieldName, onChange}) {
    const resource = useMemo(() => _.plural(fieldName), [fieldName])
    const items = useHttpState(`/admin/api/${resource}`)
    return <Select value={value} onChange={v => onChange(parseInt(v))} options={items == null?[]: items.data}/>
}
