// 监听数据变化
// vue会追踪数据变化，react不会，react在setState的时候，就会更新页面，
// 我们可以通过componentShouldUpdate方法来决定，是否更新组件
// 本着自动化的目标，我们也期望对数据依赖做出追踪，然后当state变化的时候，自动更新

import util from './util'

// 主要是用来检验对象是不是一个被Observe过得对象
class RvDataHook {
    constructor(deepObserve, observeKey){
        this.observeKey = observeKey
        this.deepObserve = deepObserve
    }
}

// 监听数据
/**
 * [observe description]
 * @param  {[type]}   data                [需要监听的对象]
 * @param  {Boolean}  [deepObserve=false] [是否深度监听]
 * @param  {Function} callback            [数据变化后，的毁掉函数]
 * @param  {String}   [prevKey='']        [传递完整的key->key->key]
 * @return {[type]}                       [返回observe data]
 */
const __RvHook__ = '__RvHook__'
class Observe {
    constructor(data, callback, deepObserve = false){
        this.callback = callback
        let newData = this.observeObject(data, deepObserve)

        let {observeKey, triggerCallback} = this
        // 埋一个不可枚举的属性，用来添加新属性
        Object.defineProperty(newData, __RvHook__, {
            get(){
                return new RvDataHook(deepObserve, observeKey)
            } ,
            enumerable: false
        })
        return newData
    }
    triggerCallback = (itemPrevKey, array, oldValue)=>{
        this.callback && this.callback(itemPrevKey, array, oldValue)
    }
    observeObject(data, deepObserve = false, prevKey = '', isSet = false) {
        let newData = {}
        Object.keys(data).forEach(key => {
            if (data.hasOwnProperty(key)) {
                let value = data[key]
                this.observeKey(newData, key , value, deepObserve, prevKey, isSet)
            }
        })

        return newData
    }
    observeKey = (newData, key, value, deepObserve = false,  prevKey = '', isSet = false) => {
        let itemPrevKey = prevKey + key + ','
        // 深度监听
        if (deepObserve) {
            if (util.isObject(value)) {
                value = this.observeObject(value, deepObserve, itemPrevKey, isSet)
            } else if (util.isArray(value)) {
                value = this.observeArray(value, deepObserve, itemPrevKey, isSet)
            }
        }

        let that = this
        Object.defineProperty(newData , key, {
            get(){
                return value
            },
            set(newValue){

                let oldValue = value
                value = newValue

                // 如果新值还是obj，那就继续监听
                if (deepObserve) {
                    if (util.isObject(value)) {
                        value = that.observeObject(value, deepObserve, itemPrevKey, true)
                    } else if (util.isArray(value)) {
                        value = that.observeArray(value, deepObserve, itemPrevKey, true)
                    }
                }

                // 回调函数
                that.triggerCallback(itemPrevKey, newValue, oldValue)

            },
            enumerable: true,
        })

        // 如果{info : {name: 1}} set info 后也会触发 info.name
        isSet && this.triggerCallback(itemPrevKey, value)

    }
    observeArray(array, deepObserve, itemPrevKey) {
        let that = this
        array = [...array]
        // 监听数组push,pop,splice,reverse,shift,unshift
        ;['push', 'pop', 'splice', 'reverse', 'shift', 'unshift'].forEach(key =>{
            Object.defineProperty(array, key, {
                get(){
                    return function(...args){
                        let oldValue = [...array]
                        let result = Array.prototype[key].call(array, ...args)
                        that.triggerCallback(itemPrevKey, array, oldValue)
                        return result
                    }
                }
            })
        })

        return array
    }
}

/**
 * [setDataProperty 给已被Observe的对象，添加新属性，新属性可以被继续监控]
 * @method setDataProperty
 * @param  {Object}        [data={}] [description]
 * @param  {String}        [key='']  [description]
 * @param  {[type]}        value     [description]
 */
function setDataProperty(data = {}, key = '' , value) {
    let info = data[__RvHook__]
    if (info instanceof RvDataHook) {
        let {
            deepObserve,
            observeKey,
        } = info
        observeKey(data, key , value, deepObserve, '', true)
    }
    return data
}

export {
    Observe,
    setDataProperty
}
