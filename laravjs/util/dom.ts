import _ from "./dash"

const _promiseCache: {[key: string]: Promise<any>} = {}

export function dynScript(src: string, onLoad?: Function): Promise<any> {
    const hashCode = _.hash(src).toString()
    if (_promiseCache[hashCode]) {
        return _promiseCache[hashCode]
    }

    return _promiseCache[hashCode] = new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.id = hashCode
        script.src = src
        script.onload = () => {
            const result = onLoad && onLoad()
            resolve(result)
        }
        script.onerror = reject
        document.head.appendChild(script)
    })
}

export function dynStyle(src: string, onLoad?: Function): Promise<any> {
    const hashCode = _.hash(src).toString()
    if (_promiseCache[hashCode]) {
        return _promiseCache[hashCode]
    }

    return _promiseCache[hashCode] = new Promise((resolve, reject) => {
        const link = document.createElement('link')
        link.id = hashCode
        link.rel = 'stylesheet'
        link.href = src
        link.onload = () => {
            const result = onLoad && onLoad()
            resolve(result)
        }
        link.onerror = reject
        document.head.appendChild(link)
    })
}

