/**
 *
 * 根据组件的id返回对应组件和组件在属性结构的路径
 * @param {Array} array
 * @param {String} id 组件的唯一ID
 * @returns {{path:Array;component:Object}} 返回对应的组件和组件在树形结构中的路径
 *
 */
export function findComponentPathById(array, id) {
    const findComponent = (controls, isRoot) => {
        for (let index = 0; index < controls.length; index++) {
            const element = controls[index]
            if (isRoot) {
                componentPath = []
            }
            if (element.id === id) {
                componentPath.push(index)
                return element
            } else if (element.type === 'container') {
                componentPath.push(index)
                let ele = findComponent(element.children, false)
                if (ele) return ele
            }
        }
    }
    let componentPath = []
    const component = findComponent(array, true)
    return { path: componentPath, component }
}

/**
 *
 * 类似数组的find(fn)方法
 * @param {Array} array
 * @param {Function} fn 返回 true表示直接返回该元素
 * @returns {Object}
 */
export function findComponent(array, fn) {
    const findComponent = (controls) => {
        for (let index = 0; index < controls.length; index++) {
            const element = controls[index]
            if (fn(element)) {
                return element
            } else if (element.type === 'container') {
                let ele = findComponent(element.children)
                if (ele && fn(ele)) return ele
            }
        }
    }
    return findComponent(array)
}

export function deepCopyComponent(item) {
    item = JSON.parse(JSON.stringify(item))

    const setNewId = (item) => {
        item.id = generateId()
        if (item.children) {
            item.children.forEach(setNewId)
        }
    }

    setNewId(item)
    return item
}

/**
 *
 * 基于不可变数据结构，只修改指定路径下的对象。如果回调函数返回false表示删除该路径对应的对象
 *
 * @param {Array} array
 * @param {Array} path
 * @param {(item:Object)=> Object|Boolean} callback
 * @returns {Array} 返回新的数组
 *
 */
export function updateTreeIn(array, path, callback) {
    path = path.slice()  // 生成一个path的浅拷贝，但因为path里全是整数，所以浅拷贝之后的修改不会应用到原数组
    let resultArray = array.slice()  // 也是浅拷贝，但注意array里面存的是一堆对象（组件），所以修改他们会影响到array的对象的值
    let index = path.shift()  // 删除path数组中的第一个元素，index是被删除的元素
    let firstIndex = index
    let newData = { ...resultArray[index] }  //
    let object = newData
    // 以下几行代码都是为了顺着给定的path寻找控件
    while (path.length > 0) {
        index = path.shift()
        if (newData.children && newData.children.length > 0) {
            newData.children = newData.children.slice()
            if (path.length === 0) {  // 已经找到了要修改的组件
                // 调用callback，传入原来的组件，获得经过callback函数计算后得到的新的组件
                let _obj = callback({ ...newData.children[index] })
                // 赋值新的组件，此时this.controls已更新
                // 也同时会自动更新渲染的内容
                newData.children[index] = _obj
                // 一种可能的删除功能？
                if (!_obj) newData.children.splice(index, 1)
                resultArray[firstIndex] = object
                // 返回由原来的array（通常是this.controls）变换而来的新array，调用完之后一般直接将返回值赋给this.controls
                return resultArray
            } else {
                let _obj = { ...newData.children[index] }
                newData.children[index] = _obj
                newData = _obj
            }
        }
    }

    let _obj = callback(newData)
    resultArray[index] = _obj
    if (!_obj) resultArray = resultArray.filter(Boolean)
    return resultArray
}

/**
 *
 * @param {Array} array
 * @param {Array} ids
 * @param {(object:Object)=>Object|Boolean} callback
 */
export function batchUpdateIn(array, ids, callback) {
    return array
        .map((item) => {
            if (ids.includes(item.id)) {
                return callback({ ...item })
            }
            return item
        })
        .filter(Boolean)
}

/**
 *
 * @returns {string}
 */
export function generateId() {
    return (
        Date.now() +
        Math.random()
            .toString()
            .slice(2)
    )
}
