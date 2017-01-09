let {Component} = window.Rv
import './index.scss'
import Link from './../../Link'

class Mine extends Component {
    template = `<div id="page-mine">
        <div class="avatar"></div>
        <p>千年尸王毛润之</p>
        <p>这是一个简单的App</p>
        <Link href="/" class="">去首页</Link>
        <Link href="/mine" class="">我的</Link>
    </div>`
    components = {Link}
}

routers['/mine'] = Mine
