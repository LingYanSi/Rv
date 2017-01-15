
/**
 * [diff 比较数组，返回数组的修改意见]
 * @method diff
 * @param  {Array}  [newList=[]] [description]
 * @param  {Array}  [oldList=[]] [description]
 * @return {[type]}              [description]
 */
function diff(NEW_LIST = [], OLD_LIST = []){
    // old: [10, 1, 2, 3, 4]
    // new: [2, 1, 5, 4, 3, 11, 22]
    // 删除 -> 移动 -> 新增
    let newList = [...NEW_LIST]
    let oldList = [...OLD_LIST]

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

    let {needMoveList, movedList} = move(newList, oldList)

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

    let index = 0
    let LEN = newList.length
    while (index < LEN) {
        target = newList[index]
        targetPrev = newList[index - 1]
        current = target
        let oldIndex = oldList.indexOf(current)
        if (oldIndex> -1) {
            currentPrev = oldList[oldIndex - 1]

            if (targetPrev !== currentPrev ) {
                oldList.splice(oldIndex, 1)
                oldList.splice(index, 0 , target)
                needMoveList.push({
                    oldIndex,
                    index
                })
                console.log(current, `${oldIndex}移动等到${index}`)
            }
        }

        index++
    }

    return {
        needMoveList,
        movedList: oldList
    }
}

diff([3, 1, 2, 5, 7, 8], [1, 2, 3, 4])

export default diff
