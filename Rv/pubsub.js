/**
 * 一个简单的事件广播，接收系统
 * 需要这个玩意儿是为了，组件间通信，但是这么一来，组件的状态就似乎变得不可维护了
 * 因为，我不太确定触发这个事件，哪个地方会受到影响
 * 如此便有了flux/redux那一套东西，有一个统一的store，dispatch/action/reduce/store
 * 同样的store，同样的状态，看起来很美好
 */
class Pubsub {
    constructor(){
        this.listeners = {}
    }
    // 触发
    trigger(channel = '', data){
        let listener = this.listeners[channel]
        listener && listener.forEach(callback => callback(data))

        return this
    }
    // 监听
    on(channel = '', callback){
        let listener = this.listeners[channel] || []
        listener.push(callback)
        this.listeners[channel] = listener

        return this
    }
    // 关闭
    off(channel = '', callback){
        let listeners = this.listeners
        let listener = listeners[channel]

        if (listener) {
            listeners[channel] = listener.filter(ele => {
                // 如果callback不存在，就移除所有
                return callback ? callback != ele : false
            })
            if (!listeners[channel].length) {
                delete listeners[channel]
            }
        }

        return this
    }
}

export default Pubsub
