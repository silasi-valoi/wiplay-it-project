

export const isNumber = (value)=> {
        return typeof value === 'number' && isFinite(value);
    }

export const isArray =(value)=> {
        return value && typeof value === 'object' && value.constructor === Array;
    }

export const isFunction =(value)=> {
        return typeof value === 'function';
    }

export const isObject =(value)=> {
        return value && typeof value === 'object' && value.constructor === Object;
    }

    // Returns if a value is null
export const isNull = (value) => {
        return value === null;
    }

    // Returns if a value is undefined
export const isUndefined = (value) => {
        return typeof value === 'undefined';
    }

    // Returns if a value is a boolean
export const isBoolean = (value) => {
        return typeof value === 'boolean';
    }
    // Returns if a value is a regexp
export const isRegExp = (value) => {
        return value && typeof value === 'object' && value.constructor === RegExp;
    }

    // Returns if a value is a regexp
export const isString = (value) => {
        return value && typeof value === 'string' || value instanceof String;
    }

