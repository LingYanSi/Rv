
let {Component} = window.Rv

import './index.scss'

class Movies extends Component {
    template = `<div id="movies">
        <div v-for="item in list" class="item" style={'background-image:url(' + item.poster + ')'} key={item.id}>
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
    method = { 
        onHide(){
            this.listenScroll = 0
        },
        onShow(){
            this.listenScroll = 1
        }
    }
    componentDidMount(){

        window.addEventListener('scroll', ()=>{
            if (!this.listenScroll) return
            if (document.body.scrollTop >= document.body.scrollHeight - window.innerHeight - 200) {
                let newList = [{
                    poster: 'http://ww1.sinaimg.cn/mw1024/61ca8acdgw1fbkgbck9wkj20go0b7gnq.jpg',
                    title: 'i的 是的发生的的风格'
                },{
                    poster: 'http://ww1.sinaimg.cn/mw1024/61ca8acdgw1fbkgbck9wkj20go0b7gnq.jpg',
                    title: 'i的 是的发生的的风格'
                },{
                    poster: 'http://ww1.sinaimg.cn/mw1024/61ca8acdgw1fbkgbck9wkj20go0b7gnq.jpg',
                    title: 'i的 是的发生的的风格'
                }]
                this.list.push(...newList)
            }
        })
    }
    componentDidUnMount(){
        console.log('电影组件卸载了')
    }
}

routers['/movies'] = Movies
