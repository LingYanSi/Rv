
// 事件
export default class Event {
    constructor($ele){
        this.cache = {}
        this.$ele = $ele
    }
    off(type, id, callback){
        let arr = this.getTypeCache(type)
        arr.filter(i => {
            if (callback) {
                return i.id != id && i.callback != callback
            } else {
                return i.id != id
            }

        })
        this.cache[type] = arr

        return this
    }
    on(type, id, callback){
        let arr = this.getTypeCache(type)
        arr.push({
            id,
            callback
        })
        this.cache[type] = arr

        this.addEventToParent(type, id, callback)

        return this
    }
    trigger(type, id){

    }
    addEventToParent(type, id, callback){
        if(this[`__${type}`]) return

        this[`__${type}`] = true

        this.$ele.addEventListener(type, (event)=>{
            // 在事件系统内冒泡上去到当前文件内
            let {target, currentTarget} = event
            let cbs = []
            while (target && target != currentTarget.parentElement) {
                let id = target.__RVID
                this.cache[type].forEach(i => {
                    if (i.id === id) {
                        cbs.push(i.callback)
                    }
                })
                target = target.parentElement
            }
            cbs.forEach(cb => cb(event))
        })
    }
    unmount(ID){
        let {cache} = this
        Object.keys(cache).forEach(i => {
            cache[i] = cache[i].filter(ele => ele.id != ID)
        })
    }
    unmountAll(){
        this.cache = {}
    }
    getTypeCache(type){
        let {cache} = this
        return cache[type] || []
    }
}
