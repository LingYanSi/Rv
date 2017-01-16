import getDependenceVarible from './getDependenceVarible'
import Tick from './tick'
import util from './util'
import diff from './diff'
import $ from './$'
import Event from './domEvent'

let tick = new Tick()

const IF = 'v-if'
const FOR = 'v-for'
const REF = 'ref'

const TYPE_TEXT_NODE = 'TEXT_NODE'
const TYPE_ATTR = 'ATTR'

/**
 * [transform description]
 * @method transform
 * @param  {[type]}  ast [description]
 * @return {[type]}      [description]
 */
function transform(ast, state, listeners, $parent, components, props) {

    // 处理子节点
    function handleChildren(array, $ele, node, ctx) {

        let eles = array.map(i => {
            return handleElement(i, [...ctx], $ele)
        })

        return $ele
    }

    // 处理元素节点
    function handleElement(node, ctx, $parent, isVIF = false, isVFOR = false) {
        // 可以访问父节点
        $parent = $parent || document.createDocumentFragment()

        let ele
        let {children, atrributes, name, type} = node
        if (name) {

            // 处理slot
            if (name == 'slot') {
                handleChildren(props.children, $parent, node, props.ctx)
                return
            }

            let FORatrribute = node.atrributes && node.atrributes[FOR]

            if (!isVFOR && FORatrribute) {
                return handleVFor(FORatrribute, $parent, node, ctx)
            }

            // 处理if
            if (!isVIF && atrributes[IF]) {
                handleVIf(atrributes[IF], $parent, node, ctx)
                return
            }

            // 处理子组件
            if (/^[A-Z]/.test(name)) {
                // throw new Error(`cannot handle tagName of ${name}`)
                let props = Object.assign({}, getAttributes(atrributes, ctx), {children, ctx})
                let child = window.Rv.DOMRender(components[name], $parent, props)
                // 处理ref
                if (props.ref) {
                    refs[props.ref] = child
                }
                // 子组件放在父组件的children中，方便卸载
                // 组件卸载：事件 + dom
                __children.push(child)

                // 不处理for循环里的属性
                if (!atrributes[FOR]) {
                    // 处理props
                    handleAttributes(atrributes, child.$ele, ctx, true, function(key, newValue, oldValue) {
                        handlePropsUpdate(child, key, newValue, oldValue)
                    }, CTXX)
                }

                return child.$ele
            }

            ele = document.createElement(name)
            handleEvents(ele)
            handleAttributes(atrributes, ele, ctx, false, null, CTXX)
            handleChildren(children, ele, node, [...ctx])

            if (isVIF) {
                $parent.parentNode.insertBefore(ele, $parent)
                return ele
            }

        } else {
            ele = handleTextNode(node, ctx, CTXX)
        }

        $parent.appendChild(ele)

        return ele
    }

    // 处理文本节点
    function handleTextNode(node, ctx, CTXX) {
        let {type, value} = node
        let $ele = document.createTextNode("")
        handleEvents($ele)
        if (type == 'Expr') {
            value = handleExpr(value, {
                type: TYPE_TEXT_NODE,
                $ele: $ele
            }, ctx, null, true, CTXX)
        }
        $ele.textContent = value

        return $ele
    }

    // 处理for循环
    function handleVFor(VFOR, $parent, node, ctx) {
        let {value} = VFOR
        let arr = value.split(/\sin\s/g).filter(i => i.trim())
        let VAR = arr[0]
        let LIST = arr[1]

        // console.log(node.atrributes)
        let isHaveKey = !!node.atrributes['key']

        function render(list) {
            $parent.innerHTML = ''

            // 目前不支持Object更新
            // 是否使用key进行更新过
            // 如果使用key，则会先进性一边数组去重
            let isArray = util.isArray(list)
            if (!isArray) {
                throw new Error (`${VFOR} type need be a Array`)
            }

            if (isHaveKey) {
                list = getUniqueArray(list, node, ctx, VAR)
            }

            let eles = Object.keys(list).forEach(key => {
                let newCtx = {}
                key = isArray ? +key : key
                let item = list[key]

                if (/^\([^\)]+\)$/.test(VAR)) {
                    let arr = VAR.slice(1, -1).split(/\s+/).filter(i => i)

                    let itemName = arr[0]
                    let indexName = arr[1]

                    itemName && (newCtx[itemName] = item)
                    indexName && (newCtx[indexName] = key)
                } else {
                    newCtx[VAR] = item
                }

                let attributes = getAttributes(node.atrributes, [...ctx, newCtx])

                return handleElement(node, [
                    ...ctx,
                    newCtx
                ], $parent, false, true)
            })

            return $parent
        }


        let result = handleExpr(LIST, {
            attributeName: FOR,
            $ele: $parent
        }, ctx, function(matched, newValue, oldValue) {
            // 处理列表变化
            handleList(newValue, oldValue, $parent, node, VAR, ctx, isHaveKey)
        }, true, CTXX)

        render(result)
    }

    // 使用key有个问题在于，直接更新数组
    // 单后两次有key相同，但数据其实已经变化的情况
    // 于此的解决方案：id + updateTime来解决，不然队列就不更新了，蜜汁尴尬
    function getUniqueArray(list, node, ctx, VAR){
        let newList = list.map((item, index) => {
            let newCtx = {}

            if (/^\([^\)]+\)$/.test(VAR)) {
                let arr = VAR.slice(1, -1).split(/\s+/).filter(i => i)

                let itemName = arr[0]
                let indexName = arr[1]

                itemName && (newCtx[itemName] = item)
                indexName && (newCtx[indexName] = index)
            } else {
                newCtx[VAR] = item
            }

            let attributes = getAttributes(node.atrributes, [...ctx, newCtx])

            return {
                key: attributes['key'],
                item
            }
        })

        return util.uniqueArray(newList, 'key').map(i => i.item)
    }

    // 处理list
    function handleList(newValue, oldValue, $parent, node, VAR, ctx, isHaveKey) {
        // 处理key
        if (isHaveKey) {
            newValue = getUniqueArray(newValue, node, ctx, VAR)
            oldValue = getUniqueArray(oldValue, node, ctx, VAR)
        }

        let {needDeleteList, needMoveList, needAddList} = diff(newValue, oldValue)

        let childNodes = $parent.children

        // 需要删除的列表
        let cacheList = [...childNodes]
        needDeleteList.forEach(item => {
            cacheList.forEach(($child, index) => {
                if (index == item.index) {
                    unmount.element($child)
                    $.remove($child)
                }
            })
        })

        // 处理需要移动元素
        needMoveList.forEach(item => {
            [...childNodes].forEach(($child, index) => {
                if (index == item.oldIndex) {
                    $.move($parent, index, item.index)
                    // 需要更新index
                }
            })
        })

        // 处理添加元素
        needAddList.forEach((data) => {
            let newCtx = {}
            if (/^\([^\)]+\)$/.test(VAR)) {
                let arr = VAR.slice(1, -1).split(/\s+/).filter(i => i)

                let itemName = arr[0]
                let indexName = arr[1]

                itemName && (newCtx[itemName] = data.item)
                indexName && (newCtx[indexName] = data.index)
            } else {
                newCtx[VAR] = data.item
            }

            let $ele = handleElement(node, [
                ...ctx,
                newCtx
            ], null, false, true)
            $.insert($parent, $ele, data.index)
        })

        //  暂时只能去更新index属性，但其实是不应该如此的;
        ;[...$parent.children].forEach(($child, index) => {
            if (/^\([^\)]+\)$/.test(VAR)) {
                let arr = VAR.slice(1, -1).split(/\s+/).filter(i => i)

                let itemName = arr[0]
                let indexName = arr[1]

                triggerCallback($child, indexName, index, CTXX)
            }

        })
    }


    // 处理if指令，不管元素是否渲染，都会留下两个占位的注释节点
    function handleVIf(VIF, $parent, node, ctx) {
        // let
        let commentStart = document.createComment('if-placeholder-start')
        $parent.appendChild(commentStart)

        let commentEnd = document.createComment('if-placeholder-end')
        $parent.appendChild(commentEnd)

        function render() {
            // 如果comment节点后面是一个元素，就删除，然后把这个节点搞上去
            return handleElement(node, ctx, commentEnd, true)
        }

        let result = handleExpr(VIF.value, {
            attributeName: IF,
            $ele: $parent
        }, ctx, function(matched, newValue, oldValue) {
            // 监听数据变化
            deleteNextElement(commentStart, CTXX)
            newValue && render()
        }, true, CTXX)

        result && render()
    }


    // 返回element list
    // 每个组件在实例上都会维护一个事件委托
    // 但是有些事件是可以委托的，有些事件是无法委托的：scroll onpause onplay等
    function handleEvents($ele) {
        // 每个元素的id应该是唯一的
        $ele.__RVID = window.Rv.__id++;
        if (events) {
            return
        }
        events = new Event($ele)
        unmount = new Unmount(listeners, events, state)

        $ele.__Rv = new RvElementHook(listeners, events, __children, state, () => {
            unmount.element($ele)
        })
        __$ele = $ele

        CTXX = {
            events,
            unmount,
            $ele,
            ctx,
            state,
            refs,
            listeners,
            children: __children
        }
    }

    let CTXX = {}
    let refs = {}
    let ctx = [state]
    let __$ele
    let events
    let unmount
    let __children = []

    handleChildren(ast.children, $parent, ast, ctx)
    return {refs, events, children: __children, $ele: __$ele}
}

// 删除下一个元素
function deleteNextElement(NODE, CTXX) {
    let $ele = NODE.nextSibling
    let {unmount} = CTXX
    // 判断节点类型是不是元素节点
    if ($ele.nodeType === 1) {
        // 卸载元素
        unmount.element($ele)
        NODE.parentNode.removeChild($ele)
    }
}

// 更新for循环内的元素
function triggerCallback($ele, indexName, index, CTXX) {
    let {state} = CTXX
    let newCtx = {}
    newCtx[indexName] = index

    state.__triggerCallback(`${indexName}`, index, 0, $ele.__RVID, newCtx)
    if (!($ele.__Rv instanceof RvElementHook)) {
        let children = [...$ele.childNodes]
        children.length && children.forEach($child => {
            triggerCallback($child, indexName, index, CTXX)
        })
    }
}

// 处理表达式
function handleExpr(expr, watchParams, ctx, callback, IS_LISTEN = true, CTXX = {} ) {
    // const { listeners, events} = CTXX
    let param = Object.assign({}, ...ctx)
    let a = new Function('param', `
            with(param){
                return ${expr}
            }
        `)

    let exprKeys = Analysis(expr)

    let {$ele, type, attributeName} = watchParams

    let timeout = null
    IS_LISTEN && CTXX.listeners.push($ele, $ele.__RVID, (key, newValue, oldValue, RVID = undefined, newCtx = {}) => {
        // newCtx 用来更新上下文
        // RVID 用来更新指定节点
        let keys = key.split(',').filter(i => i).join('.')
        let matched = exprKeys.some(i => keys.startsWith(i))

        // 数据来了
        if (!matched)
            return
        if (RVID !== undefined && $ele.__RVID !== RVID)
            return

        let {cacheAtrribute} = watchParams
        // 数据更新后，惰性更新
        // clearTimeout(timeout)
        // timeout = setTimeout(()=>{
        //
        // })
        tick.push(keys, () => {

            let Ctx = ctx.slice(1)
            Ctx.unshift(CTXX.state)

            let newParam = Object.assign({}, ...Ctx, newCtx)
            let newAttribute = watchParams.cacheAtrribute = a(newParam)

            // 处理回调
            if (callback) {
                // 对于数组来说，我们需要newValue与oldValue，而不是with下的表达式的值
                if (attributeName == FOR) {
                    callback(keys, newValue, oldValue)
                } else {
                    callback(keys, newAttribute, cacheAtrribute)
                }
                return
            }

            // 更新文本节点
            if (type == TYPE_TEXT_NODE) {
                $ele.textContent = newAttribute
            }

            // 更新属性
            if (type == TYPE_ATTR) {
                handleSpecialAttr(attributeName, newAttribute || '', $ele, cacheAtrribute, CTXX)
            }
        })
    })

    // 去监听数据
    watchParams.cacheAtrribute = a(param)
    return watchParams.cacheAtrribute
}

// expr : String
//      | Number
//      | Variables
//      | ()
// operator : + | - | * | / | && | || | ++ | -- | ! | !!!

/**
     * [Analysis 分析表达式，获取依赖数组]
     * @method Analysis
     * @param  {String} expr [description]
     */
function Analysis(expr = '') {
    // 分析表达式，获取依赖被依赖属性数组，当数据发生变化的时候和数组进行比对，如果匹配成功就更新节点
    return getDependenceVarible(expr)
}

/**
     * [handlePropsUpdate 处理props更新]
     * @method handlePropsUpdate
     * @return {[type]}          [description]
     */
function handlePropsUpdate(component, key, newValue, oldValue) {
    component.props[key] = newValue
    component.__triggerCallback(`props,${key}`, newValue, oldValue)
}

/**
     * [getAttributes 获取所有属性的值]
     * @method getAttributes
     * @param  {Object}      [atrributes={}] [description]
     * @param  {Array}       [ctx=[]]        [description]
     * @return {Array}                      [description]
     */
function getAttributes(atrributes = {}, ctx = []) {
    let atts = {}
    Object.keys(atrributes).map(key => {
        let v = atrributes[key]

        if (!v)
            return

        let {type, value} = v
        value = value || ''

        if (type == 'String') {
            atts[key] = value
        }

        if (type == 'Expr') {
            // 处理事件表达式，但这里不用监听表达式
            let isSpread = false
            if (value.startsWith('...')) {
                isSpread = true
                value = value.slice(3)
            }
            let result = handleExpr(value, {
                type: TYPE_ATTR,
                attributeName: key
            }, ctx, null, false)

            if (isSpread) {
                atts = Object.assign({}, atts, result)
            } else {
                atts[key] = result
            }
        }
    })

    return atts
}

/**
     * [handleAttributes 处理属性]
     * @method handleAttributes
     * @param  {Object}         [atrributes={}] [description]
     * @param  {Dom}            $ele            [description]
     * @param  {Array}          ctx             [上下文环境]
     * @return {[type]}                         [description]
     */
function handleAttributes(atrributes = {}, $ele, ctx = [], isComponent = false, callback, CTXX) {
    // 需要先处理object spread
    Object.keys(atrributes).filter(i => {
        return i != FOR && i != IF
    }).map(key => {
        let v = atrributes[key]
        if (v) {
            let {type, value} = v
            value = value || ''
            if (type == 'String') {
                !isComponent && $ele.setAttribute(key, value)
            }

            if (type == 'Expr') {
                // 处理Object spread
                if (value.startsWith('...')) {
                    value = value.slice(3)

                    // 暂不支持对spread props的变更追踪
                    let result = handleExpr(value, {
                        type: TYPE_ATTR,
                        $ele,
                        attributeName: key
                    }, ctx, isComponent && callback, true, CTXX)

                    Object.keys(result).forEach(key => {
                        handleSpecialAttr(key, result[key], $ele, CTXX)
                    })
                    return
                } else {
                    value = handleExpr(value, {
                        type: TYPE_ATTR,
                        $ele,
                        attributeName: key
                    }, ctx, isComponent && callback,  true, CTXX)
                }
            }

            // 处理特殊的属性
            !isComponent && handleSpecialAttr(key, value, $ele, CTXX)

        } else {
            !isComponent && $ele.setAttribute(key, "")
        }
    })
}

/**
     * [handleSpecialAttr 处理特殊属性]
     * @method handleSpecialAttr
     * @param  {String}          key   [description]
     * @param  {*}          value [description]
     * @param  {Dom}          $ele  [description]
     * @return {[type]}                [description]
     */
function handleSpecialAttr(key = '', value, $ele, CTXX) {
    let {events, refs} = CTXX
    if (key.startsWith('on')) {
        // 移除掉之前的事件
        events.off(key.slice(2).toLowerCase(), $ele.__RVID)

        // 新增事件监听
        util.isFunction(value) && events.on(key.slice(2).toLowerCase(), $ele.__RVID, value)

    } else if (key == 'style') {
        // 初始样式
        handleStyle($ele, value)
    } else if (key == 'complete-style') {
        // 初始样式
        setTimeout(() => {
            $ele.clientWidth
            handleStyle($ele, value)
        }, 0)
    } else if (key == 'class') {
        // 初始样式
        handleClass($ele, value)
    } else if (key == REF) {
        refs[value] = $ele
    } else {
        $ele.setAttribute(key, value)
    }
}

/**
     * [handleClass 处理className]
     * @method handleClass
     * @param  {Dom}    $ele       [description]
     * @param  {String}    [value=''] [description]
     * @return {String}               [description]
     */
function handleClass($ele, value = '') {
    let className = ''
    if (typeof value == 'object') {
        className = Object.keys(value).map(key => {
            let newKey = key.replace(/[A-Z]/g, char => {
                return '-' + char.toLowerCase()
            })
            return value[key]
                ? newKey
                : ''
        }).filter(key => key).join(' ')
    } else {
        className = value || ''
    }

    $ele.className = className
    return className
}

/**
     * [handleStyle 处理样式Style]
     * @method handleStyle
     * @param  {Dom}    $ele       [description]
     * @param  {String}    [value=''] [description]
     * @return {String}               [description]
     */
function handleStyle($ele, value = '') {
    let style = ''
    if (typeof value == 'object') {
        for (var propertyName in value) {
            if (value.hasOwnProperty(propertyName)) {
                // 处理驼峰形式的css
                let newPropertyName = propertyName.replace(/[A-Z]/g, char => {
                    return '-' + char.toLowerCase()
                })
                style += `;${newPropertyName} : ${value[propertyName]}`
            }
        }
    } else {
        style = value || ''
    }

    $ele.style.cssText += style

    return style
}

/**
 * 在元素上留一个钩子，方便直到其是否为组件根元素
 */
class RvElementHook {
    constructor(listeners, events, children, state, unmount) {
        this.isComponentRoot = true
        this.listeners = listeners
        this.events = events
        this.unmount = unmount
        this.children = children,
        this.component = state
    }
}

// 卸载根组件
function unmountElement($ele) {
    if ($ele.__Rv instanceof RvElementHook) {
        $ele.__Rv.unmount()
        $ele.parentNode.removeChild($ele)
    }
}

// 卸载组件
class Unmount {
    constructor(listeners, events, component) {
        this.listeners = listeners
        this.events = events
        this.component = component
    }
    // 卸载元素
    element($parent) {
        if ($parent.__Rv instanceof RvElementHook && $parent.__Rv.isComponentRoot) {
            let {componentWillUnMount, componentDidUnMount, offPS} = $parent.__Rv.component
            // 组件将要卸载
            componentWillUnMount()

            this.listeners.unmount($parent.__RVID)

            $parent.__Rv.listeners.unmountAll()
            $parent.__Rv.events.unmountAll()

            // throw new Error()
            $parent.__Rv.children.forEach(component => {
                component.$ele.__Rv.unmount()
            })
            offPS()
            // 组件已卸载
            componentDidUnMount()

            return
        }
        if ($parent.__RVID) {
            this.listeners.unmount($parent.__RVID)
            // 卸载事件
            this.events.unmount($parent.__RVID)

            this.children($parent)
        }
    }
    // 卸载子元素
    children($parent) {
        $parent.children && [...$parent.children].forEach($child => {
            this.element($child)
        })
    }
}

// 还需要一个事件管理系统，在这个事件系统内，事件也可以冒泡传递
// 组件创建完成后开始监听
// 组件销毁掉后，关闭监听

export {transform, unmountElement, tick}
