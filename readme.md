# Rv开发笔记

## 目的
赶着2016年的尾巴，学习了一点编译原理，然后就想实现一个jsx的parser，但无奈要想实现jsx的parser就必须要先实现一个js的parser，难度有一些大。
比对一下，还是vue得模板解析简单一些，因此就拿他开刀了。不过这里，目前还没有严格按照vue的规范去解析。更多的是跟着自己的节奏走。

但是jsx要比字符串模板更灵活，可以在render里面随意搞，而字符串模板相对就灵活性受限



## 已实现
- 组件嵌套
- 事件委托
- 数据监听
- 字符串模板解析
- 模板内表达式的以来追踪
- slots
- etc

## 待实现

## 语法
```js
let {Component, DOMRender} = window.Rv

class Name extends Component {
    template = `<span>Rv</span>`
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
}

class App extends Component{
    template = `
        <div aa="cc" dd={ 0 ? "我怎么知道呢" : 22} ee ff ssss="1111" onClick={parentClick}>
            <H1 width="100">
                <span onClick={slotClick}>我是标题</span>
            </H1>
            <input type="text" placeholder={name} value={input} v-if={true} onKeyUp={keyup} ref="input" /><button onClick={add}>提交</button>
            <div bb="dd" v-click="11111" onclick={click} >{input}</div>
            <ul v-for="x in showList">
                <li>{$index + 1} : {x.title} : {x.content} <button onclick={del} data-index={$index}>删除</button></li>
            </ul>
            <p style={styles}>倒计时{time}秒 <button onClick={reset}>reset</button></p>
        </div>
    `
    components = {H1}
    data = {
        name: '西方哪个国家',
        input: '',
        ll: {
            f: 1
        },
        styles: {
            background: 'rgb(144, 203, 132)',
            paddingLeft: '100px',
            height: '200px'
        }
    }
    method = {
        slotClick(){
            alert('slotClick')
        }
    }
    // 生命周期
    componentDidMount(){
        this.startTime()
    }
}

DOMRender(App, document.querySelector('#app'))

```
