
import getDependenceVarible from './getDependenceVarible'

/**
 * [transform description]
 * @method transform
 * @param  {[type]}  ast [description]
 * @return {[type]}      [description]
 */
function transform(ast, state, listeners, $parent, components, props) {
    const IF = 'v-if'
    const FOR = 'v-for'
    const REF = 'ref'

    const TYPE_TEXT_NODE = 'TEXT_NODE'
    const TYPE_ATTR = 'ATTR'

    // 处理子节点
    function handleChildren(array, $ele, node, ctx){
        let FORatrribute = node.atrributes && node.atrributes[FOR]

        if (FORatrribute) {
            return handleVFor(FORatrribute, $ele, array[0], ctx)
        }

        let eles = array.map(i => {
            return handleElement(i, [...ctx], $ele)
        })

        return $ele
    }

    // 处理元素节点
    function handleElement(node, ctx, $parent, isVIF = false){
        // 可以访问父节点
        let ele
        let {children, atrributes, name, type} = node
        if (name) {
            // 处理子组件
            if (/^[A-Z]/.test(name)) {
                // throw new Error(`cannot handle tagName of ${name}`)
                let props = Object.assign({}, getAttributes(atrributes, ctx), {
                    children,
                    ctx
                })
                let child = window.Rv.DOMRender(components[name], $parent, props)
                // 子组件放在父组件的children中，方便卸载
                // 组件卸载：事件 + dom
                __children.push(child)
                return
            }

            // 处理slot
            if (name == 'slot') {
                handleChildren(props.children, $parent, node, props.ctx)
                return
            }

            // 处理if
            if (!isVIF && atrributes[IF]) {
                handleVIf(atrributes[IF], $parent, node , ctx)
                return
            }

            ele = document.createElement(name)
            handleEvents(ele)
            handleAttributes(atrributes, ele, ctx)
            handleChildren(children, ele, node, [...ctx])

            if (isVIF) {
                $parent.parentNode.insertBefore(ele, $parent)
                return ele
            }
        } else {
            ele = handleTextNode(node, ctx)
        }

        $parent.appendChild(ele)

        return ele
    }

    // 处理文本节点
    function handleTextNode (node, ctx){
        let {type, value} = node
        let $ele = document.createTextNode("")
        handleEvents($ele)
        if (type == 'Expr') {
            value = handleExpr(value, {
                type: TYPE_TEXT_NODE,
                $ele: $ele,
            }, ctx)
        }
        $ele.textContent = value

        return $ele
    }

    // 处理for循环
    function handleVFor(VFOR, $parent, node, ctx){
        let {value} = VFOR
        let arr = value.split(/\sin\s/g).filter(i => i.trim())
        let VAR = arr[0]
        let LIST = arr[1]

        function render(state){
            $parent.innerHTML = ''

            let eles = state[LIST].map((i, index) => {
                let newCtx = {}
                if (/^\([^\)]+\)$/.test(VAR)) {
                    let arr = VAR.slice(1, -1).split(/\s+/).filter(i => i)

                    let itemName = arr[0]
                    let indexName = arr[1]

                    itemName && (newCtx[itemName] = i)
                    indexName && (newCtx[indexName] = index)
                } else {
                    newCtx[VAR] = i
                }

                return handleElement(node, [...ctx, newCtx], $parent)
            })

            return $parent
        }

        render(state)

        listeners.push($parent, $parent.__RVID, (key, newValue, oldValue)=>{
            key = key.trim()
            let keys = key.split(',').filter(i => i)
            if(keys[0] == LIST) {
                // 卸载元素上的事件
                unmount.children($parent)
                render(state)
            }
        })

    }

    // 处理if指令，不管元素是否渲染，都会留下两个占位的注释节点
    function handleVIf(VIF, $parent, node, ctx){
        // let
        let commentStart = document.createComment('if-placeholder-start')
        $parent.appendChild(commentStart)


        let commentEnd = document.createComment('if-placeholder-end')
        $parent.appendChild(commentEnd)

        function render(){
            // 如果comment节点后面是一个元素，就删除，然后把这个节点搞上去
            return handleElement(node, ctx, commentEnd, true)
        }

        // 删除下一个元素
        function deleteNextElement(){
            let $ele = commentStart.nextSibling
            // 判断节点类型是不是元素节点
            if ($ele.nodeType === 1) {
                // 卸载元素
                unmount.element($ele)
                commentStart.parentNode.removeChild($ele)
            }
        }

        let result = handleExpr(VIF.value, {
            attributeName: IF,
            $ele: $parent
        }, ctx, function(matched, newValue, oldValue){
            // 监听数据变化
            deleteNextElement()
            newValue && render()
        })

        result && render()
    }

    // 处理表达式
    function handleExpr(expr, watchParams, ctx, callback, IS_LISTEN = true){
        let param = Object.assign({}, ...ctx)
        let a = new Function('param', `
            with(param){
                return ${expr}
            }
        `)

        let exprKeys = Analysis(expr)

        let {$ele, type, attributeName} = watchParams

        IS_LISTEN && listeners.push($ele, $ele.__RVID, (key, newValue, oldValue)=>{
            let keys = key.split(',').filter(i => i).join('.')
            let matched = exprKeys.some(i => keys.startsWith(i))

            if (!matched) return

            let {cacheAtrribute} = watchParams
            let newCtx = ctx.slice(1)
            newCtx.unshift(state)

            let newParam = Object.assign({}, ...newCtx)
            let newAttribute = watchParams.cacheAtrribute = a(newParam)

            // 处理回调
            if(callback) {
                return callback(matched, newAttribute, cacheAtrribute)
            }

            // 更新文本节点
            if(type == TYPE_TEXT_NODE) {
                $ele.textContent = newAttribute
            }

            // 更新属性
            if(type == TYPE_ATTR) {
                handleSpecialAttr(attributeName, newAttribute || '', $ele, cacheAtrribute)
            }
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

    function Analysis(expr) {
        // 分析表达式，获取依赖被依赖属性数组，当数据发生变化的时候和数组进行比对，如果匹配成功就更新节点
        return getDependenceVarible(expr)
    }

    // 获取所有属性的值
    function getAttributes(atrributes, ctx){
        let atts = {}
        Object.keys(atrributes).map(key => {
            let v = atrributes[key]

            if (!v) return

            let {type, value} = v
            value = value || ''

            if (type == 'String') {
                atts[key] = value
            }

            if (type == 'Expr') {
                // 处理事件表达式，但这里不用监听表达式
                atts[key] = handleExpr(value, {
                    type: TYPE_ATTR,
                    attributeName: key,
                }, ctx, null, false)
            }
        })

        return atts
    }

    // 处理属性
    function handleAttributes(atrributes, $ele, ctx){
        Object.keys(atrributes).filter(i => {
            return i != FOR && i != IF
        }).map(key => {
            let v = atrributes[key]
            if (v) {
                let {type, value} = v
                value = value || ''
                if (type == 'String') {
                    $ele.setAttribute(key, value)
                }

                if (type == 'Expr') {
                    // 处理事件监听
                    value = handleExpr(value, {
                        type: TYPE_ATTR,
                        $ele,
                        attributeName: key,
                    }, ctx)
                }

                // 处理特殊的属性
                handleSpecialAttr(key, value, $ele )

            } else {
                $ele.setAttribute(key, "")
            }
        })
    }

    // 处理特殊的属性
    function handleSpecialAttr(key, value, $ele){
        if (key.startsWith('on')) {
            // 移除掉之前的事件
            events.off(key.slice(2).toLowerCase(), $ele.__RVID )
            // 新增事件监听
            events.on(key.slice(2).toLowerCase(), $ele.__RVID, value)

        } else if (key == 'style'){
            // 初始样式
            let style = ''
            if (typeof value) {
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

        } else {
            $ele.setAttribute(key, value)
        }

        // 处理ref
        if (key == REF) {
            refs[value] = $ele
        }

    }

    // 返回element list
    // 每个组件在实例上都会维护一个事件委托
    // 但是有些事件是可以委托的，有些事件是无法委托的：scroll onpause onplay等
    function handleEvents($ele){
        // 每个元素的id应该是唯一的
        $ele.__RVID = window.Rv.__id++
        if (events) {
            return
        }
        events = new Event($ele)
        unmount = new Unmount(listeners, events, state)

        $ele.__Rv = {
            isComponentRoot: true,
            listeners,
            events,
            unmount(){
                unmount.element($ele)
            },
            children: __children,
            component: state
        }
        __$ele = $ele
    }

    let refs = {}
    let ctx = [state]
    let __$ele
    let events
    let unmount
    let __children = []

    handleChildren(ast.children, $parent, ast, ctx)
    return {
        refs,
        events,
        children: __children,
        $ele: __$ele
    }
}

// 卸载组件
class Unmount {
    constructor(listeners, events, component){
        this.listeners = listeners
        this.events = events
        this.component = component
    }
    element($parent){
        if ($parent.__Rv && $parent.__Rv.isComponentRoot) {
            let {componentWillUnMount, componentDidUnMount} = $parent.__Rv.component
            // 组件将要卸载
            componentWillUnMount()

            $parent.__Rv.listeners.unmountAll()
            $parent.__Rv.events.unmountAll()

            // throw new Error()
            $parent.__Rv.children.forEach(component => {
                component.$ele.__Rv.unmount()
            })
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
    children($parent){
        $parent.children && [...$parent.children].forEach($child => {
            this.element($child)
        })
    }
}

// 事件
class Event {
    constructor($ele){
        this.cache = {}
        this.$ele = $ele
    }
    off(type, id, callback){
        let arr = this.getTypeCache(type)
        arr.filter(i => {
            if (callback) {
                return i.id != id && i.callback != callback
            } else {
                return i.id != id
            }

        })
        this.cache[type] = arr

        return this
    }
    on(type, id, callback){
        let arr = this.getTypeCache(type)
        arr.push({
            id,
            callback
        })
        this.cache[type] = arr

        this.addEventToParent(type, id, callback)

        return this
    }
    trigger(type, id){

    }
    addEventToParent(type, id, callback){
        if(this[`__${type}`]) return

        this[`__${type}`] = true

        this.$ele.addEventListener(type, (event)=>{
            // 在事件系统内冒泡上去到当前文件内
            let {target, currentTarget} = event
            let cbs = []
            while (target && target != currentTarget.parentElement) {
                let id = target.__RVID
                this.cache[type].forEach(i => {
                    if (i.id === id) {
                        cbs.push(i.callback)
                    }
                })
                target = target.parentElement
            }
            cbs.forEach(cb => cb(event))
        })
    }
    unmount(ID){
        let {cache} = this
        Object.keys(cache).forEach(i => {
            cache[i] = cache[i].filter(ele => ele.id != ID)
        })
    }
    unmountAll(){
        this.cache = {}
    }
    getTypeCache(type){
        let {cache} = this
        return cache[type] || []
    }
}

export default transform
