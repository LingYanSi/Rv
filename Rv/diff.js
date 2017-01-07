
/**
 * [diff description]
 * @method diff
 * @param  {Array}  [newList=[]] [description]
 * @param  {Array}  [oldList=[]] [description]
 * @return {[type]}              [description]
 */
function diff(newList = [], oldList = []){
    // [10, 1, 2, 3, 4]
    // [2, 1, 5, 4, 3, 11, 22]
    // oldList 与 newList进行比对
    // 先删除
    let arr = []
    oldList.forEach((item, index) => {
        if (!newList.includes(item)) {
            arr.push({
                type: 'DELETE',
                index
            })
        }
    })

    newList.forEach((item, index) => {
        // 查询能不能找到，能找到move，否则add
        let oldIndex = oldList.indexOf(item)
        if (oldIndex < 0) {
            arr.push({
                type: 'INSERT',
                index
            })
        } else {
            arr.push({
                type: 'MOVE',
                arr: [oldIndex, index]
            })
        }
    })

}

export default diff
