import Nine from './9'
import Modal from './Modal'
import Nav from './Nav'
import Home from './Pages/Home'
import Movies from './Pages/Movies'
import Mine from './Pages/Mine'
let {Component, DOMRender, ps, set, nextTick} = window.Rv

class Page extends Component {
    template = `<div style="padding-bottom: 50px;">
        <div v-if={pageShow}>
            <Page1 />
        </div>
    </div>`
    components = {
        Page1: null
    }
    data = {
        pageShow: false
    }
    method = {

    }
    componentDidMount(){
        Page.self = this
    }
    static update = (Component)=>{
        let that = Page.self
        that.components.Page1 = Component
        that.pageShow = true

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

    let router = {
        push(url){
            currentRouter = url

            let Component = routers[url]
            Page.update(Component)

            listenCaches.forEach(fn => fn(url))
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

router.push('/')
