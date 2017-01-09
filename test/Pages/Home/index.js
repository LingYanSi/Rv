import Modal from './../../Modal'
let {Component, DOMRender, ps, set, nextTick} = window.Rv


let id = 0
let list= [
    {
        title: '今天的哈哈哈',
        content: "☺☺☺☺☺",
        tag: 'today',
        id: id++
    }
]

class Name extends Component {
    template = `<span>Rv</span>`
    componentWillUnMount(){
        console.log('Name组件将要被卸载')
    }
    componentDidUnMount(){
        console.log('Name组件已经被卸载')
    }
}

class H1 extends Component {
    template = `<h1 onclick={click} class="center"><Name />{state} {props.width} <slot></slot></h1>`
    data = {
        state: ' Todo List'
    }
    components = {Name}
    method = {
        click(){
            this.state += ' +1s'
        }
    }
    componentWillMount(){
        console.log('组件将要加载')
    }
    componentDidMount(){
        ps.on('fuck', function(data){
            alert(data)
        })
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
            <input type="text" onInput={input} ref="input"/>
            <div>{text}</div>
            <button onClick={close}>关闭</button>
        </div>
    `
    data = {
        text: ''
    }
    method = {
        close(){
            Modal.close()
        },
        input(){
            this.text = this.refs.input.value
        }
    }
}

class Item extends Component {
    template = `
        <li style={styles} complete-style={complateStyle} onClick={fuck}>
            {props.i + 1} : {props.item.title} : {props.item.content} <button onclick={props.del} data-index={props.item.id}>删除</button>
        </li>
    `
    data = {
        styles: {
            background: 'rgb(144, 203, 132)',
            height: '50px',
            transition: 'all .8s'
        },
        complateStyle: {
            background: 'red',
            height: '30px'
        },
    }
    method = {
        fuck(){
            Modal.open('body', '', {
                Body: Open,
                props: {
                    msg: 'test 组件传递是否正常'
                }
            })
        }
    }
}

class Home extends Component {
    template = `<div>
        <header>
            Rv
        </header>
        <H1 width="100">
            <span onClick={slotClick}>我是标题</span>
        </H1>
        <input type="text" placeholder={name} value={input} v-if={vIf} onKeyUp={keyup} ref="input" />
        <input type="text" style="border: 20px solid red; " placeholder={name} value={input} v-if={!vIf} onKeyUp={keyup} ref="input" />
        <button onClick={add}>提交</button>
        <div style="line-height: 2;" v-click="11111" onclick={click} >{input}</div>
        <ul v-for="(item i) in showList">
            <Item i={i} item={item} del={del}></Item>
        </ul>
        <div>
            <button class={currentFilter == 'today' && 'current' } onClick={filter.bind(this, 'today')}>今天</button>
            <button class={currentFilter == 'date' && 'current' } onClick={filter.bind(this, 'date')}>本周</button>
            <button class={currentFilter == 'month' && 'current' } onClick={filter.bind(this, 'month')}>本月</button>
            <button class={currentFilter == 'all' && 'current' } onClick={filter.bind(this, 'all')}>全部</button>
        </div>
        <p>倒计时{time}秒 <button onClick={reset}>reset</button></p>
    </div>`
    data = {
        // name: '西方哪个国家',
        input: '',
        vIf: true,
        ll: {
            f: 1
        },
        list,
        showList: list,
        currentFilter: 'all',
        time: 3,
        left: 0
    }
    components = {H1, Name, Item}
    method = {
        slotClick(){
            alert('slotClick')
        },
        parentClick(){
            console.log('播放啦')
        },
        keyup(event) {
            if(event.keyCode == 13) {
                this.add(event)
            }
            this.input = event.target.value
        },
        del(event) {
            this.list = this.list.filter(ele => ele.id != +event.target.dataset['index'])
            this.filter()
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
        filter(type){
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
        }
    }
    // 事件监听
    events = {

    }
    // 生命周期
    componentDidMount(){
        this.startTime()
        ps.on('fuck:you', function(data){
            alert('wocao')
        })

        this.$set(this, 'name', 'fuck you bithc')

        setTimeout(()=>{
            this.name = '哈哈哈'
            console.log(this.refs.input.getAttribute('placeholder'))
            // 此处有bug
            nextTick(()=>{
                console.log(this.refs.input.getAttribute('placeholder'))
            })
        }, 2000)

    }
}

routers['/'] = Home
export default Home
