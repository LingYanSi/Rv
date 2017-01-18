import Modal from './../../Modal'
let {Component, DOMRender, ps, set, nextTick} = window.Rv
import onTap from './../../Link/tap'


let id = 0
let list= [
    {
        title: '今天的哈哈哈',
        content: "☺☺☺☺☺",
        tag: 'today',
        id: id++
    }
]


class H1 extends Component {
    template = `<h1 onclick={click} class="center">{state} {props.width} {props.name}<slot></slot></h1>`
    data = {
        state: ' Todo List'
    }
    components = {}
    method = {
        click(){
            this.state += ' +1s'
        }
    }
    componentWillMount(){
        console.log('组件将要加载')
    }
    componentDidMount(){
        console.log('组件加载成功')
    }
    componentWillUnMount(){
        console.log('H1组件将要被卸载')
    }
    componentDidUnMount(){
        console.log(ps.off('fuck'))
        console.log('H1组件已经被卸载')
    }
}

class Open extends Component {
    template = `
        <div>
            <p>{props.msg}</p>
            <input type="text" onInput={input} ref="title" value={props.title}/>
            <div>{text}</div>
            <input type="text" value={props.content} ref="content" />
            <button onClick={submit}>提交</button>
        </div>
    `
    data(){
        return {
            text: this.props.title
        }
    }
    method = {
        submit(){
            let title = this.refs.title.value
            let content = this.refs.content.value
            this.$ps.trigger('list::change', {
                title,
                content,
                id: this.props.id
            })
            Modal.close()
        },
        input(){
            this.text = this.refs.title.value
        }
    }
}

class Item extends Component {
    template = `
        <li style={styles} complete-style={complateStyle} >
            <div>
                <h4>{props.i + 1} : {props.title} : {props.i}</h4>
                <p>
                    {props.content}
                </p>
            </div>
            <button {...onTap(props.del)} data-index={props.id}>删除</button>
            <button {...onTap(edit)}>编辑</button>
        </li>
    `
    componentDidMount(){
        // console.log('Item加载完成')
    }
    data = {
        styles: {
            background: '',
            padding: '10px',
            borderBottom: '1px solid #fff',
            transition: 'all .8s'
        },
        complateStyle: {
            background: 'rgb(144, 212, 143)',
        },
    }
    method = {
        onTap,
        edit(){
            Modal.open('body', '', {
                Body: Open,
                props: this.props
            })
        }
    }
    event = {
        listItem(data){
            console.log('list列表', data)
        }
    }
}

class Home extends Component {
    template = `<div>
        <header>
            Rv
        </header>
        <H1 width={width} {...test}>
            <span onClick={slotClick}>我是标题</span>
        </H1>
        <input placeholder={name}  v-if={vIf} x-webkit-speech="true" onKeyUp={keyup} ref="input" />
        <input type="text" style="border: 20px solid red; " placeholder={name} value={input} v-if={!vIf} onKeyUp={keyup} ref="input" />
        <button onClick={add}>提交</button>
        <div style="line-height: 2;" v-click="11111" onclick={click} >{input}</div>
        <ul>
            <div v-for="(item i) in showList" key={item.id}>
                {i+1}
                <div>
                    <Item i={i} {...item} del={del}></Item>
                </div>
            </div>
        </ul>
        <div>
            <button class={currentFilter == 'today' && 'current' } data-type="today" {...onTap(filter)}>今天</button>
            <button class={currentFilter == 'date' && 'current' } data-type="date" {...onTap(filter)}>本周</button>
            <button class={currentFilter == 'month' && 'current' } data-type="month" {...onTap(filter)}>本月</button>
            <button class={currentFilter == 'all' && 'current' } data-type="all" {...onTap(filter)}>全部</button>
            <button  {...onTap(reserve)}>反转</button>
        </div>
        <p>倒计时{time}秒 <button onClick={reset}>reset</button></p>
        <button onClick={checkNetwork}>校验网络</button><span>{network}</span>
    </div>`
    data = {
        // name: '西方哪个国家',
        input: '',
        vIf: true,
        test: {
            name: '胡锦涛'
        },
        list,
        width: 100,
        showList: list,
        currentFilter: 'all',
        time: 3,
        left: 0,
        network: navigator.onLine ? '联网' : '断网',
    }
    components = {H1, Item}
    method = {
        onTap,
        checkNetwork(){
            this.network = navigator.onLine ? '联网' : '断网'
        },
        slotClick(){
            // alert('slotClick')
            this.width++
            this.test = {
                name: '习近平'
            }
            console.log(this.width)
        },
        parentClick(){
            console.log('播放啦')
        },
        keyup(event) {
            if(event.keyCode == 13) {
                console.log(this.showList)
                // this.add(event)
            }
            this.input = event.target.value
        },
        del(event) {
            Modal.open('alert', '确定要删除?', {
                submit: ()=>{
                    this.list = this.list.filter(ele => ele.id != +event.target.dataset['index'])
                    this.filter()
                }
            })
        },
        add(event){
            this.list.push({
                title: '我是title',
                tag: this.currentFilter,
                content: this.refs.input.value,
                id: id++
            })

            this.input = this.refs.input.value = ''

            this.filter()
        },
        reserve(){
            this.showList.reverse()
        },
        filter(event){
            let type = event ? event.target.dataset['type'] : ''
            type = type || this.currentFilter

            this.showList = this.list.filter(i => type != 'all' ? i.tag == type : 1)

            this.currentFilter = type
        },
        click() {
            // ps.trigger('fuck', '哈哈哈哈')
            this.vIf = !this.vIf
        },
        reset(){
            if (!this.time) {
                this.time = 3
                this.startTime()
            }
        },
        startTime(){
            let interval = setInterval(()=>{
                if(this.time == 0 )
                    return clearInterval(interval)
                this.time--
                nextTick(()=>{
                    console.log('wocao')
                })
            }, 1000)
        },
        onShow(){
            console.log('页面onshoe了')
        }
    }
    // 事件监听
    event = {
        'fuck':function(data){
            console.log(data)
        },
        'list::change': function(data){
            let {id, title, content} = data
            let index
            let item
            let match = this.list.some((_item, _index) => {
                if (_item.id === id) {
                    index = _index
                    item = _item
                    return true
                }
            })

            if (match) {
                item = Object.assign({}, item, {
                    title,
                    content
                })
                console.log(this.list)
                this.list.splice(index, 1 , item)
                this.filter()
            }
        }
    }
    // 生命周期
    componentDidMount(){
        this.startTime()

        this.$set(this, 'name', 'write something')

        setTimeout(()=>{
            this.name = '哈哈哈'
            console.log('placeholder',this.refs.input.getAttribute('placeholder'))
            // 此处有bug
            nextTick(()=>{
                console.log('placeholder',this.refs.input.getAttribute('placeholder'))
            })
        }, 2000)


    }
}

routers['/'] = Home
export default Home
