
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

/**
 * [uniqueArray 数组去重]
 * @method uniqueArray
 * @param  {Array}     [arr=[]] [description]
 * @param  {String}    [key=''] [description]
 * @return {Array}             [description]
 */
function uniqueArray(arr = [], key = ''){
    let newArr = []
    let keyArr = []
    arr.forEach(item => {
        if (key && keyArr.indexOf(item[key]) < 0) {
            keyArr.push(item[key])
            newArr.push(item)
        }

        if (!key && newArr.indexOf(item) < 0) {
            newArr.push(item)
        }
    })

    newArr.length != arr.length && console.error('the value of key should be unique')
    return newArr
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
    uniqueArray,
}
