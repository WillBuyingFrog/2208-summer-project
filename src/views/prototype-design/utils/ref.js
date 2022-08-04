const ComponentRefMap = {}

export function saveComponentRef(id, ref) {
    ComponentRefMap[id] = ref
}

export function getComponentRef(id) {
    return ComponentRefMap[id]
}

export function getComponentRefsById(ids) {
    return ids.map((item) => ComponentRefMap[item])
}
export function destroyComponentRef(id) {
    ComponentRefMap[id] = null
}
