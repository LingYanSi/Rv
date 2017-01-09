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
            console.log(url === this.props.href)
            if (url === this.props.href) {
                this.current = CURRENT
            } else {
                this.current = ''
            }
        },
        change(event){
            if (!event.target.classList.contains('current')) {
                router.push(this.props.href)
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
