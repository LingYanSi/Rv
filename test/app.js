import Nine from './9'
import Modal from './Modal'
import Nav from './Nav'
import Home from './Pages/Home'
import Movies from './Pages/Movies'
import Mine from './Pages/Mine'
let {Component, DOMRender, ps, set, nextTick, tick} = window.Rv

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
    static update = (Component, url = '/', replace = false)=>{
        let that = Page.self

        let {cache} = that
        let pageIndex = 1
        let cacheScrollTop = 0
        let match = cache.some((item , index)=> {
            console.log(url, item.url)
            if(url == item.url){
                pageIndex = item.pageIndex
                cacheScrollTop = item.scrollTop
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

            console.log('哈哈哈哈哈', current, pageIndex);

            current.onShow && current.onShow()
            current.$ele.style.cssText += 'display: block;'
            that.prev = current

            console.log(url)
            that.cache.push({
                url,
                pageIndex,
            })

            if (match) {
                document.body.scrollTop = cacheScrollTop
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
    let listenCaches = []
    let currentRouter = ''

    window.addEventListener('popstate', ()=>{
        render(location.pathname)
    })

    // 渲染页面
    function render(url, replace = false){
        currentRouter = url

        let Component = routers[url]
        Page.update(Component, url, replace)

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

    let router = {
        push(url = '/', title = ''){
            render(url)
            history.pushState(title, null, url)
            changeDocumentTitle(title)
            return this
        },
        replace(url = '/', title = ''){
            render(url, true)
            history.replaceState(title, null, url)
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
        }
    }

    return router
}())

DOMRender(App, document.querySelector('#app'))

router.replace('/', '首頁')

try{
    // var utterThis = new window.SpeechSynthesisUtterance('宋小帆、李倩倩、陈莹');
    // window.speechSynthesis.speak(utterThis);
}catch(err){
    // alert(11)
}
