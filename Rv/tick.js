
// dom渲染异步
// 这里有一个bug
// 同步任务结束之后，【收集变更异步、push也异步】何时执行是一个问题
// 一个nextTick的push是同步的，因此此次的nextTick可能不在同步结束的回调上
class Tick {
    constructor(){
        this.queue = []
        this.nextTickQueue = []
    }
    push(keys, fn){
        let {queue} = this
        queue.push({keys, fn})

        clearTimeout(this.setTimeout)
        this.setTimeout = setTimeout(()=>{
            this.exec()
        }, 0)

        return this
    }
    exec(){
        // 先缓存，后执行，方便后续添加

        let cacheQueue = this.queue
        let cacheNextTickQueue = this.nextTickQueue

        this.queue = []
        this.nextTickQueue = []

        clearTimeout(this.setTimeout)
        
        cacheQueue.forEach(item => {
            item.fn()
        })
        // 执行所有id小于this.setTimeout的毁掉函数
        cacheNextTickQueue.forEach(item => {
            let {id, fn} = item
            id <= this.setTimeout && fn()
        })

        return this
    }
    pushNextTick(fn){
        this.nextTickQueue.push({
            id: this.setTimeout || -1,
            fn
        })
        return this
    }
    forceTick(){
        this.exec()
        return this
    }
}

export default Tick
