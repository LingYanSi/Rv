
function getType(obj){
    return Object.prototype.toString.call(obj).toLowerCase().split(' ')[1].slice(0, -1)
}

function isFunction(obj){
    return !!getType(obj).match('function')
}

function isObject(obj){
    return !!getType(obj).match('object')
}

function isArray(obj){
    return !!getType(obj).match('array')
}

function isBoolean(obj){
    return !!getType(obj).match('boolean')
}

function isPromise(obj){
    return !!getType(obj).match('promise')
}

function isAsyncFunction(obj){
    return !!getType(obj).match('asyncfunction')
}

function isGeneratorFunction(obj){
    return !!getType(obj).match('generatorfunction')
}

export default {
    getType,
    isFunction,
    isObject,
    isArray,
    isBoolean,
    isPromise,
    isAsyncFunction,
    isGeneratorFunction,
}
