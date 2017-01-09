window.router = (function(){
    let caches = []

    return {
        push(url){
            let Component = routers[url]
            Page.update(Component)
        }
    }
}())
