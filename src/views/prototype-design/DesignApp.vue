<template>
  <div class="ds-app" id="frog-design-application">
    <DesignAppHeader />
    <div class="content">
      <el-row :gutter="20">
        <el-col :span="4">
          <DesignAppComponents />
        </el-col>
        <el-col :span="16">
          <DesignEditorView ref="editor" :value="this.controls">
            <template #default>
              <PluginSelection :application="this" />
            </template>
          </DesignEditorView>
        </el-col>
        <el-col :span="4">
          <PropInspector @change="this.handleChange" :controlled="this.controlled" />
        </el-col>
      </el-row>
    </div>
    <DesignAppFooter />
  </div>
</template>

<script>
import DesignAppFooter from "@/views/prototype-design/DesignAppFooter";
import DesignAppHeader from "@/views/prototype-design/DesignAppHeader";

import DesignAppComponents from "@/views/prototype-design/DesignAppComponents";
import DesignEditorView from "@/views/prototype-design/editor-view"
import PropInspector from "@/views/prototype-design/prop-inspector"

import PluginSelection from "@/views/prototype-design/plugins/plugin-selection"

import {parseControls} from "@/views/prototype-design/utils/collaborate";

import {
  // 一些有关全局操作的常量
  EVENT_DESIGNER_CLEAR,
  EVENT_DESIGNER_REDO,
  EVENT_DESIGNER_UNDO,
  EVENT_COMPONENT_ADD,
  EVENT_COMPONENT_DELETE,
  EVENT_COMPONENT_DUPLICATE,
  EVENT_COMPONENT_SELECT,
  EVENT_COMPONENT_TRANSFORM,
  EVENT_COMPONENT_UNSELECT, COLLABORATE_EXPORT_JSON, EVENT_DESIGNER_SAVEIMG,
} from "@/views/prototype-design/event-enum"

import {
  batchUpdateIn,
  deepCopyComponent,
  findComponent,
  findComponentPathById,
  generateId,
  updateTreeIn,
} from "@/views/prototype-design/utils"

import eventBus from "@/views/prototype-design/utils/eventBus"

import {getSnapShot} from "@/views/prototype-design/utils/image";

let historys = [[]]
let historyPointer = 0

export default {
  name: "DesignApp",
  data() {
    return {
      controls: [],
      currentId: '',
      currentPath: [],
      controlled: {},
      designId: -1,

    }
  },
  components:{
    DesignAppHeader, DesignAppFooter, DesignAppComponents,
    DesignEditorView, PropInspector,
    PluginSelection
  },
  methods: {
    getComponents(components, parentId) {
      return components.map((item) => ({
        type: item.type,
        children: item.type === 'container' ? [] : void 0,
        id: generateId(),
        transform: {
          x: item.x - (item.x % 10),
          y: item.y - (item.y % 10),
          width: item.width,
          height: item.height,
          rotation: 0,
        },
        minHeight: 10,
        minWidth: 10,
        rotatable: true,
        resizable: true,
        draggable: true,
        acceptRatio: false,
        zoom: 1,
        active: false,
        parent: true,
        parentId,
        resizeHandler: ['tl', 'tm', 'tr', 'r', 'br', 'bm', 'l', 'bl'],
        extra: item,
        grid: [10, 10],
        axis: 'xy',
        // 以下属性用作实时协作：
        usedBy: '__none__'
      }))
    },
    getComponentsFromSaved(components){
      return components.map((item) => ({
        ...item,
        children: item.type === 'container' ? [] : void 0
      }))
    },
    /**
     * @description 批量添加组件到编辑区域，如果指定了parentid则将添加到指定的组件中。目前parentid对应的组件只能为Container类型的组件
     * @params {{components:Array,parentId:string?}}
     */
    addControl({ components, parentId }) {
      let controls = []
      let newComponents = this.getComponents(components, parentId)
      if (parentId) {
        const { path } = findComponentPathById(this.controls, parentId)
        controls = updateTreeIn(this.controls, path, (item) => {
          item.children = item.children.concat(newComponents)
          return item
        })
      } else {
        controls = this.controls.concat(newComponents)
      }
      this.setControls(controls)

      // 默认选中最后一个
      let { component } = findComponentPathById(controls, newComponents[newComponents.length - 1].id)

      // 默认选中最后一个
      this.handleSelect(component)
    },
    /**
     * @description 根据变更id的数据进行批量更新
     * @param {{[id :string]:{key:string;value:any}}} changes
     */
    batchUpdateControlValue(changes) {
      let controls = batchUpdateIn(this.controls, Object.keys(changes), (item) => {
        item[changes[item.id].key] = changes[item.id].value
        return item
      })
      this.setControls(controls)
    },
    /**
     * @description 指定id列表批量删除组件
     * @param {string[]} 要删除的组件id集合
     */
    batchDeleteControls(deleteIds) {
      let controls = batchUpdateIn(this.controls, deleteIds, () => false)
      this.setControls(controls)
    },
    /**
     * @description 更新选中组件指定的key
     * @param {String} key 组件中的字段
     * @param {any} value  新的值
     * @param {Boolean} isExtra 是否为附加参数，对应组件的extra字段。
     */
    updateControlValue(key, value, isExtra) {
      let controls = updateTreeIn(this.controls, this.currentPath, (item) => {
        if (['x', 'y', 'width', 'height', 'rotation'].includes(key)) {
          let transform = { ...item.transform }
          transform[key] = value
          item.transform = transform
          return item
        } else if (isExtra) {
          let extra = { ...item.extra }
          extra[key] = value
          item.extra = extra
        } else {
          item[key] = value
        }
        return item
      })
      this.setControls(controls)
    },
    // 组件拖拽时将新的transform同步到属性编辑器中，并在end事件中进行一次数据同步
    handleTransform({ transform, type }) {
      this.controlled = { ...this.controlled, ...transform }
      if (['resizeend', 'dragend', 'rotateend'].includes(type)) {
        this.updateControlValue('transform', transform, false)
      }
    },
    /**
     * @description 变更当前选中组件的状态
     * @param {Boolean} status
     */
    updateControlStatus(status) {
      let controls = updateTreeIn(this.controls, this.currentPath, (item) => {
        item.active = status
        return item
      })
      this.setControls(controls)
    },
    //  组件选中，右侧展示属性编辑器
    handleSelect(control) {
      this.setCurrentControl(control)
      this.updateControlStatus(true)
    },
    setCurrentControl(control) {
      // 无组件选中时，直接清除属性编辑器
      if (!control || !control.id) {
        this.clearCurrentComponent()
        return
      }

      // 将已选中的取消选中
      if (control && this.currentId) {
        let controls = updateTreeIn(this.controls, this.currentPath, (item) => {
          item.active = false
          return item
        })
        // 不加入历史记录
        this.setControls(controls, false)
      }

      // 深度拷贝数据，避免数据引用污染
      control = JSON.parse(JSON.stringify(control))
      Object.assign(control, control.transform, { active: true })
      //  将选中组件设置到当前属性编辑器中
      let { path } = findComponentPathById(this.controls, control.id)
      this.currentPath = path
      this.controlled = control
      this.currentId = control.id
    },
    // 属性编辑器变化后同步到组件中
    handleChange({ name, value, extra }) {
      if (!this.currentId) {
        return
      }
      if (extra) {
        this.controlled.extra[name] = value
      } else {
        this.controlled[name] = value
      }
      // 注意节流优化提升性能
      this.updateControlValue(name, value, extra)
    },
    getActiveComponent(ctls) {
      return findComponent(ctls, (item) => item.active)
    },
    setControls(controls, needRecordHistory = true) {
      this.controls = controls
      if (needRecordHistory) {
        historys = historys.slice(0, historyPointer + 1)
        historys.push(this.controls)
        historyPointer = historys.length - 1
      }
    },
    /**
     * @description 清空选中状态
     */
    clearCurrentComponent() {
      this.controlled = {}
      this.currentId = ''
      this.currentPath = []
    },
    initFromHistory(bounce) {
      historyPointer += bounce
      let controls = historys[historyPointer]
      this.controls = controls
    },
    // Actions
    handleUndo() {
      if (historyPointer == 0) return
      this.clearCurrentComponent()
      this.initFromHistory(-1)
      this.setCurrentControl(this.getActiveComponent(this.controls))
    },
    /**
     * @description 删除当前选中的组件
     */
    deleteComponent() {
      if (!this.currentId) {
        return
      }
      let controls = updateTreeIn(this.controls, this.currentPath, () => false)
      this.setControls(controls)
      this.clearCurrentComponent()
    },
    duplicateComponent() {
      if (!this.currentId) {
        return
      }

      let pathes = this.currentPath.slice()
      let selectedIndex = pathes.pop()

      let controls = []
      let component = null
      const newComponent = (item) => {
        // 深度拷贝，粗暴！！
        let copyOfSelected = deepCopyComponent(item)
        let t = copyOfSelected.transform
        copyOfSelected.transform = {
          x: t.x,
          y: t.y + t.height,
          width: t.width,
          height: t.height,
          rotation: t.rotation,
        }
        component = copyOfSelected
        return copyOfSelected
      }
      if (pathes.length > 0) {
        controls = updateTreeIn(this.controls, pathes, (item) => {
          let children = item.children.slice()
          let copyOfSelected = newComponent(children[selectedIndex])
          children.splice(selectedIndex + 1, 0, copyOfSelected)
          item.children = children
          return item
        })
      } else {
        controls = this.controls.slice()
        controls.splice(selectedIndex + 1, 0, newComponent(this.controls[selectedIndex]))
      }
      this.setControls(controls)
      this.setCurrentControl(component)
    },
    handleClear() {
      this.setControls([])
      this.clearCurrentComponent()
    },

    handleRedo() {
      if (historyPointer === historys.length - 1) return
      this.initFromHistory(1)
      this.clearCurrentComponent()
      this.setCurrentControl(this.getActiveComponent(this.controls))
    },
    handleUnselect() {
      if (!this.currentId) return
      this.updateControlStatus(false)
      this.clearCurrentComponent()
    },
    getEditorView() {
      return this.$refs.editor
    },
    exportControlsJson(){
      let result = parseControls(this.$data.controls)
      console.log(result)
    },
    parseComponentJSON({componentJSON, parentId}){
      // 首先清除当前画布上所有的控件
      this.setControls([])
      this.clearCurrentComponent()
      if(parentId === -1){
        // 当前在root component上遍历
        componentJSON.map((item) => {
          this.addControl({components: [item], parentId: item.parentId})
          if(item.hasChildren === false){
            // 没有子元素
            console.log("[ParseJSON] This element has no child component.")
          }else{
            // 有子元素
            let childJSON = item.childrenJSON
            this.parseComponentJSON({componentJSON: childJSON, parentId: item.id})
          }
        })
      }
    },
    handleSaveImage(){
      getSnapShot("root-editor-view")
    }
  },
  created() {
    eventBus.$on(EVENT_COMPONENT_ADD, this.addControl)
    eventBus.$on(EVENT_COMPONENT_SELECT, this.handleSelect)
    eventBus.$on(EVENT_COMPONENT_TRANSFORM, this.handleTransform)
    eventBus.$on(EVENT_COMPONENT_UNSELECT, this.handleUnselect)
    eventBus.$on(EVENT_COMPONENT_DUPLICATE, this.duplicateComponent)
    eventBus.$on(EVENT_COMPONENT_DELETE, this.deleteComponent)
    eventBus.$on(EVENT_DESIGNER_REDO, this.handleRedo)
    eventBus.$on(EVENT_DESIGNER_UNDO, this.handleUndo)
    eventBus.$on(EVENT_DESIGNER_CLEAR, this.handleClear)
    eventBus.$on(COLLABORATE_EXPORT_JSON, this.exportControlsJson)

    eventBus.$on(EVENT_DESIGNER_SAVEIMG, this.handleSaveImage)
  }

}
</script>

<style lang="less">
.ds-app{
  display: flex;
  flex-direction: column;
  min-height: 60vh;

  .content {
    .ds-editor {
      flex: 1;
      position: relative;
      width: 100%;
      overflow: scroll;
      height: 100%;
    }
  }

  .component-impl,
  .match-parent {
    width: 100%;
    height: 100%;
    min-width: 50px;
    display: block;
  }
}

</style>
