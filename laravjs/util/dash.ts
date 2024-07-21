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

    plural: (noun: string) => {
        if (noun.endsWith('y')) { // category -> categories
            return noun.substring(0, noun.length - 1) + 'ies'
        }
        return noun + 's'
    },

    singular: (noun: string) => {
        if (noun.endsWith('ies')) {
            return noun.substring(0, noun.length - 3) + 'y'
        }
        if (noun.endsWith('s')) {
            return noun.substring(0, noun.length - 1)
        }
        return noun
    },

    capitalize: (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    camel: (str: string) => {
        return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, function(match, chr)
            {
                return chr.toUpperCase();
            });
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
    },
    curry(fn: Function, ...bindArgs: any): Function {
        return (...args) => fn(...bindArgs, ...args)
    },
    curryRight(fn: Function, ...bindArgs: any): Function {
        return (...args) => fn(...args, ...bindArgs)
    }
}


export default _;
