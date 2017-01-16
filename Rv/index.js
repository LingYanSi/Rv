// let tokenizer = require('./tokenizer')
// let parser = require('./parser')

// scope 作用域问题
// expr : expr ? expr : expr
//      | element &&

// 为什么我们需要把数据处理写到jsx中
// 按理说jsx应该是只一个view层，只负责数据的渲染吗？

import tokenizer from './tokenizer'
import parser from './parser'
import {transform, unmountElement, tick} from './transform'

// 数据监听
import {Observe, setDataProperty} from './observe'
// 事件收发
import Pubsub from './pubsub'
import util from './util'

let ps = new Pubsub()
function DOMRender(Component, $parent, props = {}) {

    let fuck = new Component()
    let {data = {}, method, template, components, event = {} } = fuck
    let that = Object.assign({}, {props}, method, {components})


    if (util.isFunction(data)) {
        data = data.call(that)
    }

    let {newState, listeners, triggerCallback} = Ob(data)

    that = Object.assign(newState, that)

    // 更该function指向newState
    for (let key in that) {
        if (that.hasOwnProperty(key) && typeof that[key] == 'function') {
            that[key] = that[key].bind(that)
        }
    }

    ;['componentDidMount', 'componentWillMount', 'componentWillUnMount', 'componentDidUnMount'].forEach(key => {
        let fun = fuck[key] || function(){}
        that[key] = fun.bind(newState)
    })

    that.__triggerCallback = triggerCallback
    that.$set = setDataProperty

    that.componentWillMount();

    let tokens = tokenizer(addQuote(template))
    let ast = parser(tokens)

    handlePSEvents(that, event)
    let {refs, events, children, exprAtrributeQueue, $ele} = transform(ast, that, listeners, $parent, components, props)

    // 添加refs，组件不直接调用dom
    that.refs = refs
    that.$ps = ps
    // ele.appendChild(node)
    that.componentDidMount();

    return {
        ...that,
        refs,
        events,
        children,
        exprAtrributeQueue,
        $ele,
    }
}

function handlePSEvents(that, events){
    let isOn = false
    that.__events = {}
    function onPS(){
        if (isOn) return
        isOn = true
        // 监听
        Object.keys(events).forEach(key => {
            let fn = events[key].bind(that)
            // 监听
            ps.on(key, fn)
            that.__events[key] = fn
            return fn
        })
    }

    function offPS(){
        if (!isOn) return
        isOn = false
        // 卸载
        Object.keys(that.__events).forEach(key => {
            let fn = that.__events[key]
            // 监听
            ps.off(key, fn)
        })
    }

    onPS()

    that.onPS = onPS
    that.offPS = offPS

    return {
        onPS,
        offPS
    }
}



// 给标签内的字符串添加双引号，方便token解析
function addQuote(template) {
    let str = template.replace(/>([^<]+)</g, function($0, $1){
        let str = $1.trim().replace(/\{([^}]+)\}/g, function($0){
            return `"${$0}"`
        })

        str = str ? `>"${str}"<` : $0
        return str.replace(/""/g, '')
    })

    return str
}

// 生成可以observe的数据，并新增一个事件监听器，用来监听数据的变化
function Ob(state) {
    let listeners = new ExprAtrributeQueue()

    let {newData, triggerCallback} = new Observe(state, (...args) => {
        listeners.cache.forEach((listener, index) => {
            listener.callback(...args)
        })
    }, true)

    return {newState: newData, listeners, triggerCallback}
}

// 属性为一个表达式的情况
// 一个组件的所有属性都在其中
class ExprAtrributeQueue {
    constructor(){
        this.cache = []
    }
    push($ele, id, callback){
        this.cache.push({
            id,
            callback,
            $ele
        })
    }
    remove(id, callback){
        this.cache = this.cache.filter(i => {
            if (callback) {
                return i.id != id && i.callback != callback
            }

            return i.id != id
        })
    }
    // 卸载子元素上的无属性监听
    unmountChildrenAttrs($parent){
        $parent.children && [...$parent.children].forEach($child => {
            this.unmount($child.__RVID)
            this.unmountElementAttrs($child)
        })
    }
    // 卸载元素、及其子元素的属性监听
    unmountElementAttrs($parent){
        this.unmount($parent.__RVID)
        this.unmountChildrenAttrs($parent)
    }
    // 卸载指定id的事件监听
    unmount(ID){
        this.remove(ID)
    }
    unmountAll(){
        this.cache = []
    }
}

// 组件卸载，移除事件监听，移除

// 单组件可以运行，下面还是有组件嵌套，组件通信、样式隔离，作用域隔离等等

class Component {
    constructor(){
        console.log('初始化了')
    }
}


window.Rv = {
    Component,
    DOMRender,
    Observe,
    util,
    nextTick(fn){
        tick.pushNextTick(fn)
    },
    tick,
    unmount: unmountElement,
    set: setDataProperty,
    ps,
    __id: 0
}
