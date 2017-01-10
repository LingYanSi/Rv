let {Component} = window.Rv
import Link from './../Link'
import './index.scss'

export default class Nav extends Component {
    template = `
        <div id="nav" v-for={item in items}>
            <Link class="item" href={item.url} title={item.title} replace={false}>
                <div>{item.title}</div>
            </Link>
        </div>
    `
    components = {Link}
    data = {
        items: [
            {title: '首页', url: '/'},
            {title: '影院', url: '/movies'},
            {title: '我的', url: '/mine'}
        ]
    }
    method = {
        click(event){
            let $this = event.target;
            if (!$this.classList.contains('current')) {
                [...$this.parentNode.children].forEach(ele => {
                    ele != $this ? ele.classList.remove('current') : ele.classList.add('current')
                })
                router.push($this.dataset['url'])
            }
        }
    }
}
