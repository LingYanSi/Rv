
// 用于监听页面是否滚动，因为移动端页面滚动时，会阻塞js执行，因此我们使用一个异步事件，用来在scroll结束的时候执行
// 点击事件和滚动手势是两个独立的事件
let scroll = false
window.addEventListener('touchmove', ()=>{
    scroll = true
})

window.addEventListener('touchend', ()=>{
    setTimeout(()=>{
        scroll = false
    }, 0)
})

function onTap(func){
    // 判断及其类型
    // 只支持单指点击，有效时间间隔为200ms
    if(window.navigator.userAgent.toLowerCase().match(/phone|android|ipad|ipod/g)){
        var notMove = true
        var startTime = 0

        return {
            onTouchStart(event){
                notMove = true
                if(event.touches.length == 1){
                    startTime = new Date().getTime()
                } else {
                    notMove = false
                }
            },
            onTouchMove(){
                notMove = false
            },
            onTouchEnd(...args){
                if(scroll) return
                notMove && (new Date().getTime() - startTime < 200) && func(...args)
            }
        }
    } else {
        return {
            onClick: func
        }
    }
}

export default onTap
