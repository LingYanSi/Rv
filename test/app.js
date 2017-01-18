import Nine from './9'
import Modal from './Modal'
import Nav from './Nav'
import Home from './Pages/Home'
import Movies from './Pages/Movies'
import Mine from './Pages/Mine'
let {Component, DOMRender, ps, set, nextTick, tick} = window.Rv

class NotFound extends Component {
    template = `<div>
        404 你来到了Rv的荒原
    </div>`
}

class Page extends Component {
    template = `<div style="padding-bottom: 50px;">
        <div v-if={pageShow1}>
            <Page1 ref="Page1"/>
        </div>
        <div v-if={pageShow2}>
            <Page2 ref="Page2" />
        </div>
        <div v-if={pageShow3}>
            <Page3 ref="Page3" />
        </div>
    </div>`
    components = {
        Page1: null
    }
    data = {
        pageShow1: false,
        pageShow2: false,
        pageShow3: false,
    }
    method = {

    }
    componentDidMount(){
        Page.self = this
        this.cache = []
    }
    static update = (Component = NotFound, url = '/', replace = false)=>{
        let that = Page.self

        let {cache} = that
        let pageIndex = 1
        let cacheScrollTop = 0

        console.log(...cache)
        let match = cache.some((item , index)=> {
            if(url == item.url){
                pageIndex = item.pageIndex
                cacheScrollTop = item.scrollTop
                console.log(cacheScrollTop, url, item)
                cache.splice(index, 1)
                return true
            }
        })

        if (match) {
            // that.refs[`Page${pageIndex}`].$ele += 'display: block;'
            console.log('页面已经被缓存过')
        } else {
            if (cache.length < 3) {
                pageIndex = cache.length + 1
                console.log('page新增一个')
            } else {
                pageIndex = cache[0].pageIndex
                cache.shift()
                console.log('page新增一个，删除一个')
            }
            that.components[`Page${pageIndex}`] = Component
            that[`pageShow${pageIndex}`] = true
        }

        if (that.prev) {
            that.cache[that.cache.length - 1].scrollTop = document.body.scrollTop
        }
        // 1 2 3 4 如果已经存在
        // push(current) shift(0)
        // 调整位置
        // 如果页面已经缓存就从缓存内拿，如果不存在就从getNext()
        nextTick(()=>{
            let prev = that.prev
            let current = that.refs[`Page${pageIndex}`]
            if (prev) {
                prev.$ele.style.cssText += 'display: none;'
                prev.onHide && prev.onHide()
            }

            current.onShow && current.onShow()
            current.$ele.style.cssText += 'display: block;'
            that.prev = current

            that.cache.push({
                url,
                pageIndex,
            })

            if (match) {
                // 同步执行在页面回退的时候，可能不会滚动到指定位置
                setTimeout(()=>{
                    document.body.scrollTop = cacheScrollTop
                })
            }
        })

        tick.exec()

        return that
    }
}

class App extends Component{
    template = `
        <div>
            <Page></Page>
            <Nav />
            <Modal />
        </div>
    `
    components = {Modal, Nav, Page}
}

window.router = (function(){
    let USE_HASH = true
    let listenCaches = []
    let currentRouter = USE_HASH ? location.hash.slice(1) : location.pathname

    window.addEventListener('popstate', ()=>{
        console.log('非礼勿视')
        let url = USE_HASH ? location.hash.slice(1) : location.pathname
        render(url)
    })

    // 渲染页面
    function render(url, replace = false){
        currentRouter = url

        let Component = routers[url]
        Page.update(Component, url, replace)

        console.log('去触发Link', url)
        listenCaches.forEach(fn => fn(url))
    }

    // 更改title
    function changeDocumentTitle(title){
        document.title = title
        const UA = window.navigator.userAgent.toLowerCase()
        if (UA.match('phone') && UA.match('micromessenger')) {
            const iframe = document.createElement('iframe');
            iframe.src = '/package.json'; 
            iframe.style.cssText = 'display: none';
            const listener = () => {
                setTimeout(() => {
                    iframe.removeEventListener('load', listener);
                    setTimeout(() => {
                        document.body.removeChild(iframe);
                    }, 0);
                }, 0);
            };
            iframe.addEventListener('load', listener);
            document.body.appendChild(iframe);
        }
    }

    function changeUrl(url = '/', replace = false){
        currentRouter = url
        if (USE_HASH) {
            // location.hash = url
            url = location.pathname + '#' + url
            history.pushState('', null, url)
        } else {
            replace ? history.replaceState('', null, url) : history.pushState('', null, url)
        }
    }

    let router = {
        push(url = '/', title = ''){
            render(url)
            changeUrl(url)
            changeDocumentTitle(title)
            return this
        },
        replace(url = '/', title = ''){
            render(url, true)
            changeUrl(url)
            changeDocumentTitle(title)
            return this
        },
        getCurrentRouter(){
            return currentRouter
        },
        listen(fn){
            listenCaches.push(fn)
            return this
        },
        remove(fn){
            listenCaches = listenCaches.filter(i => i!==fn)
            return this
        },
        init(){
            console.log({currentRouter})
            render(currentRouter)
        }
    }

    return router
}())

DOMRender(App, document.querySelector('#app'))

router.init()

try{
    // var utterThis = new window.SpeechSynthesisUtterance('宋小帆、李倩倩、陈莹');
    // window.speechSynthesis.speak(utterThis);
}catch(err){
    // alert(11)
}
