
let {Component} = window.Rv

import './index.scss'

class Movies extends Component {
    template = `<div id="movies" v-for={item in list}>
        <div class="item" style={'background-image:url(' + item.poster + ')'}>
            <p>{item.title}</p>
        </div>
    </div>`
    data = {
        list: [
            {
                poster: 'http://ww1.sinaimg.cn/mw1024/61ca8acdgw1fbkgbck9wkj20go0b7gnq.jpg',
                title: 'i的 是的发生的的风格'
            },
            {
                poster: 'http://ww1.sinaimg.cn/mw1024/61ca8acdgw1fbkgbck9wkj20go0b7gnq.jpg',
                title: 'i的 是的发生的的风格'
            },
            {
                poster: 'http://ww1.sinaimg.cn/mw1024/61ca8acdgw1fbkgbck9wkj20go0b7gnq.jpg',
                title: 'i的 是的发生的的风格'
            },
            {
                poster: 'http://ww1.sinaimg.cn/mw1024/61ca8acdgw1fbkgbck9wkj20go0b7gnq.jpg',
                title: 'i的 是的发生的的风格'
            },
            {
                poster: 'http://ww1.sinaimg.cn/mw1024/61ca8acdgw1fbkgbck9wkj20go0b7gnq.jpg',
                title: 'i的 是的发生的的风格'
            },
        ]
    }
    componentDidMount(){
        console.log('电影组件加载成功')
    }
    componentDidUnMount(){
        console.log('电影组件卸载了')
    }
}

routers['/movies'] = Movies
