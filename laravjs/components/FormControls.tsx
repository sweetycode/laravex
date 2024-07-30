import { useMemo } from "preact/hooks"
import { useHttpState } from "../util/requests"
import _ from "../util/dash"

export function TextInput({value, onChange, type="text"}) {
    return <input type={type} className="border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5" value={value} onChange={e => onChange(e.target.value)}/>
}

export function DateTimeInput({value, onChange}) {
    return <TextInput type='datetime-local' value={value} onChange={onChange} />
}

export function CommaTextInput({value, onChange}) {
    return <TextInput value={value.join(',')} onChange={(newValue) => onChange(newValue.split(','))} />
}

export function TextArea({value, onChange}) {
    return <textarea value={value} onChange={e => onChange(e.target.value)} className="border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"></textarea>
}

export function Select({value, onChange, options}) {
    return <select className="border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5" value={value? value: 0} onChange={e => onChange(e.target.value)}>
        <option value="0">None</option>
        {options.map(({id, name}) => <option value={id}>{name}</option>)}
    </select>
}

export function BelongsToSelect({value, fieldName, onChange}) {
    const resource = useMemo(() => _.plural(fieldName), [fieldName])
    const items = useHttpState(`/admin/api/${resource}`)
    return <Select value={value} onChange={v => onChange(parseInt(v))} options={items == null?[]: items.data}/>
}
