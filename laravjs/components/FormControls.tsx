import { useEffect, useMemo, useRef } from "preact/hooks"
import { useHttpState } from "../util/requests"
import _ from "../util/dash"
import { dynScript, dynStyle } from "../util/dom"

export function TextInput({value, onChange, type="text"}) {
    return <input type={type} className="border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full py-1.5 px-2" value={value} onChange={e => onChange(e.target.value)}/>
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

export function DateTimePicker({value, onChange}) {
    const ref = useRef(null)
    const instance = useRef(null)
    useEffect(() => {
        dynStyle('https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css')
        dynScript('https://cdn.jsdelivr.net/npm/flatpickr').then(() => {
            instance.current = window.flatpickr(ref.current, {
                enableTime: true,
                dateFormat: 'Y-m-d H:i:00',
                allowInput: true,
            })
        })

        return () => {
            if (instance.current != null) {
                instance.current.destroy()
                instance.current = null
            }
        }
    }, [])

    useEffect(() => {
        if (instance.current) {
            instance.current.setDate(value, false, '')
        }
    }, [value])

    return <input ref={ref} type='text' className="border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-60 p-1.5" onChange={e => onChange(e.target.value)}/>
}
