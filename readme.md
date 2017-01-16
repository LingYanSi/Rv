# Rv开发笔记

## 目的
赶着2016年的尾巴，学习了一点编译原理，然后就想实现一个jsx的parser，但无奈要想实现jsx的parser就必须要先实现一个js的parser，难度有一些大。
比对一下，还是vue得模板解析简单一些，因此就拿他开刀了。不过这里，目前还没有严格按照vue的规范去解析。更多的是跟着自己的节奏走。

## 已实现
- 组件嵌套
- 事件委托
- 数据监听
- 字符串模板解析
- For循环内index的更新
- 模板内表达式的依赖追踪
- Object spread
- slots
- complete-style
- 组件传递
- 事件广播 【event内方法，在componentDidMount前托管到PubSub,componentDidUnMount前off】
- 数组 -> key
- etc

## 待实现
- 事件广播[组件传递、父子组件、兄弟组件]

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
    event = {
        // this.$ps.trigger('updateName', '哈哈哈')
        updateName(name){
            this.name = name
        }
    }
    // 生命周期
    componentDidMount(){
        this.startTime()
    }
}

DOMRender(App, document.querySelector('#app'))

```

## 文档Doc
### Rv做了什么事情？
- Rv会把template字符串解析成DOM树
- 在DOM树转真实DOM时候，注入一些逻辑
- 对data做observe监控
- 对属性进行依赖追踪，数据更新的时候就可以自动属性


## JSX与字符串模板比较

jsx要比字符串模板更灵活，可以在render里面随意搞，而字符串模板相对就灵活性受限

### jsx有语言级别的优先级
- jsx

```js
import onTap from 'module/onTap'
import {Component} from 'react'

class Fuck extends Component {
    click(){
        alert('11')
    }
    render(){
        return <div {...onTap(this.click)}></div>
    }
}
```

- js string template

```js
import onTap from 'module/onTap'
import {Component} from 'react'

class Fuck extends Component {
    templte = `<div {...onTap(this.click)}></div>`
    method = {
        onTap,
        click(){
            alert('11')
        }
    }
}
```

如上，可以发现在jsx中把onTap import进来后，不用把onTap注入到Fuck中，因为jsx编译器会把
```js
<div {...onTap(this.click)}></div>
```
编译成
```js
react.createClass('div',{...onTap(this.click)}, [])
```
因此jsx，可以直接使用Fuck所处的上下文中的变量
