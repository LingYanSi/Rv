
import util from './util'

/**
 * [diff 比较数组，返回数组的修改意见]
 * @method diff
 * @param  {Array}  [newList=[]] [description]
 * @param  {Array}  [oldList=[]] [description]
 * @return {[type]}              [description]
 */
function diff(NEW_LIST = [], OLD_LIST = [], isHaveKey){
    // old: [10, 1, 2, 3, 4]
    // new: [2, 1, 5, 4, 3, 11, 22]
    // 删除 -> 移动 -> 新增
    let newList = util.uniqueArray([...NEW_LIST] , isHaveKey && 'key')
    let oldList = util.uniqueArray([...OLD_LIST] , isHaveKey && 'key')

    // 删除元素
    let needDeleteList = []
    oldList = oldList.filter((item, index) => {
        if (!newList.includes(item)) {
            needDeleteList.push({
                index,
                item
            })
            return false
        }
        return true
    })

    // 移动元素
    let {needMoveList, movedList} = move(newList, oldList)

    // 新增元素
    let needAddList = []

    newList.forEach((item, index) => {
        if (!movedList.includes(item)) {
            needAddList.push({
                index,
                item
            })
        }
    })

    return {
        needDeleteList,
        needMoveList,
        needAddList,
    }
}

function move(NEW_LIST = [], OLD_LIST = []){
    let newList = [...NEW_LIST]
    let oldList = [...OLD_LIST]
    let needMoveList = []

    let target
    let targetPrev
    let current
    let currentPrev
    let currentPrevPrev

    let index = 0
    let LEN = newList.length
    while (index < LEN) {
        target = newList[index]
        targetPrev = newList[index - 1]
        current = target
        let oldIndex = oldList.indexOf(current)

        if (oldIndex> -1) {
            currentPrev = oldList[oldIndex - 1]
            currentPrevPrev = oldList[oldIndex - 2]
            // 为了避免每次数组更新都需要移动节点
            // 我们发现，如果比较current/target前一个元素是否相等，就可以避免不必要的移动
            // old [1, 2, 3, 4, 5]
            // new [5, 1, 2, 3, 4]
            // 如上只需要移动一次即可
            //
            // 然而对于
            // old [5, 1, 2, 3, 4]
            // new [1, 2, 3, 4, 5]
            // 按照上面的方法还是会移动5次
            // 因此，我们会忽略第一次比较
            if (targetPrev !== currentPrev && (!currentPrev || currentPrevPrev !== targetPrev) ) {
                oldList.splice(oldIndex, 1)
                oldList.splice(index, 0 , target)
                needMoveList.push({
                    oldIndex,
                    index
                })
                // console.log(current, `${oldIndex}移动等到${index}`)
            }
        }

        index++
    }

    return {
        needMoveList,
        movedList: oldList
    }
}

// diff([3, 1, 2, 5, 7, 8], [1, 2, 3, 4])

export default diff
