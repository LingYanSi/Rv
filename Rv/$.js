// 处理dom
let $ = {
    remove($ele){
        $ele.parentNode.removeChild($ele)
    },
    insert($parent, $ele, index){
        let children = [...$parent.children]
        if (index >= children.length) {
            $parent.appendChild($ele)
        } else {
            $parent.insertBefore($ele, children[index])
        }
    },
    move($parent, currentIndex, targetIndex){
        let children = [...$parent.children]
        let child = children[currentIndex]
        $parent.removeChild(child)
        this.insert($parent, child, targetIndex)
    }
}

export default $
