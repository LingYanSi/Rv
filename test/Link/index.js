let {Component} = window.Rv
import onTap from './tap'

const CURRENT = ' current'
class Link extends Component {
    template = `<a href="javascript:void(0);"
            style="text-decoration: none;"
            data-href={props.href}
            class={props.class + current}
            {...onTap(change)}>
        <slot></slot>
    </a>`
    data = {
        current: ''
    }
    method = {
        onTap,
        handleRouterChange(url){
            if (url === this.props.href) {
                this.current = CURRENT
            } else {
                this.current = ''
            }
        },
        change(event){
            let {href, title, replace} = this.props
            if (!event.target.classList.contains('current')) {
                replace ? router.replace(href, title) : router.push(href, title)
            }
        }
    }
    componentDidMount(){
        this.current = this.props.href == router.getCurrentRouter() ? CURRENT : ''
        router.listen(this.handleRouterChange)
    }
    componentDidUnMount(){
        router.remove(this.handleRouterChange)
    }
}

export default Link
