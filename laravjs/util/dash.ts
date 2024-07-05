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
}


export default _;
