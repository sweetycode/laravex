let _autoIncVal = 0


const _ = {
    get: function <T>(data: {[key: string]: T}|null, key: string, defaultValue: T|null = null): T|null {
        return data != null ? (data[key] ?? defaultValue): defaultValue
    },

    autoInc: () => ++_autoIncVal,

    debounce: (callback: Function, wait: number) => {
        let timeoutId: number|null = null;
        return (...args) => {
          timeoutId && window.clearTimeout(timeoutId);
          timeoutId = window.setTimeout(() => {
            callback(...args);
          }, wait);
        };
    },

    pluralize: (noun: string) => {
        if (noun.endsWith('y')) { // category -> categories
            return noun.substring(0, noun.length - 1) + 'ies'
        }
        return noun + 's'
    },

    hash: (s: string) => {
        let hash = 0
        if (s.length === 0) return hash;
        for (let i = 0; i < s.length; i++) {
            let chr = s.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }
}


export default _;
