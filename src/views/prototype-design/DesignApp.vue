<template>
    <div class="ds-app" id="frog-design-application">
      <div class="content">
        <el-container>
          <el-aside width="200px" class="leftpane">
            <DesignAppComponents />
          </el-aside>
          <el-main class="mainPane">
            <el-container>
              <el-container>
                <el-header class="header">
                  <DesignAppHeader />
                </el-header>
                <el-main class="workpane">
                  <div
                      :style="{width: this.initWidth + 'px', height: this.initHeight + 'px'}"
                  >
                    <DesignEditorView ref="editor" :value="this.controls">
                      <template #default>
                        <PluginSelection :application="this" />
                      </template>
                    </DesignEditorView>
                  </div>

                </el-main>
              </el-container>
              <el-aside width="240px" class="rightpane">
                <PropInspector
                    @propChange="this.handleChange"
                    :controlled="this.controlled" />
              </el-aside>
            </el-container>
          </el-main>
        </el-container>
      </div>
    </div>
</template>

<script>
import DesignAppHeader from "@/views/prototype-design/DesignAppHeader";

import DesignAppComponents from "@/views/prototype-design/DesignAppComponents";
import DesignEditorView from "@/views/prototype-design/editor-view"
import PropInspector from "@/views/prototype-design/prop-inspector"

import PluginSelection from "@/views/prototype-design/plugins/plugin-selection"


import eventBus from "@/views/prototype-design/utils/eventBus"

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
  EVENT_COMPONENT_UNSELECT, COLLABORATE_EXPORT_JSON, EVENT_DESIGNER_SAVEIMG, EVENT_DESIGNER_SWITCH, DEV_CREATE_TEMPLATE
} from "@/views/prototype-design/event-enum"

import {
  batchUpdateIn,
  deepCopyComponent,
  findComponent,
  findComponentPathById,
  generateId,
  updateTreeIn,
} from "@/views/prototype-design/utils"

import {getSnapShot} from "@/views/prototype-design/utils/image";
import {
  _exportControlsJson, _exportTemplateToBackend,
  _level_loadCanvasInit,
} from "@/views/prototype-design/utils/prototypeJSON";
import {computed} from "vue";
import {
  level_deleteCollaborateComponent, level_getCollaboratePrototype, level_switchPage,
  level_updateCollaborateComponent
} from "@/views/prototype-design/utils/collaborate_level";

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
      file_id: "-1",
      file_name: "-1",
      userId: "-1",
      layer: 0,   // 当前组件的层数
      pages: [],  // 所有Page的完整json
      currentPage: null,  // 当前Page的完整json
      initWidth: 900,   // 测试数据
      initHeight: 900,  // 测试数据
      isPreviewMode: 1
    }
  },
  components: {
    DesignAppHeader, DesignAppComponents,
    DesignEditorView, PropInspector,
    PluginSelection
  },
  provide() {
    return {
      pages: computed(() => this.pages)
    }
  },
  methods: {
    reloadComponents(components) {
      return components.map((item) => {
        let newItem = {
          ...item,
          childrenJSON: "",
        }
        return newItem
      })
    },
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
        acceptRatio: true,
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
    /**
     * @description 批量添加组件到编辑区域，如果指定了parentid则将添加到指定的组件中。目前parentid对应的组件只能为Container类型的组件
     * @params {{components:Array,parentId:string?}}
     */
    addControl({components, parentId, isReload = 0}) {
      console.log("Into addControl function.")
      let controls = []
      let newComponents = null
      if (isReload) {
        console.log("This function is in reload mode.")
        newComponents = this.reloadComponents(components, parentId)
        // console.log("newComponents:", newComponents)
      } else {
        newComponents = this.getComponents(components, parentId)
      }
      if (parentId) {
        const {path} = findComponentPathById(this.controls, parentId)
        controls = updateTreeIn(this.controls, path, (item) => {
          item.children = item.children.concat(newComponents)
          return item
        })
      } else {
        controls = this.controls.concat(newComponents)
      }
      this.setControls(controls)
      console.log("New set of controls:", controls)

      // 默认选中最后一个
      let {component} = findComponentPathById(controls, newComponents[newComponents.length - 1].id)

      console.log("Newly added component:", component)

      // isReload=2代表协作模式，协作模式下跳过选中环节
      // idReload=1代表这个组件是初始阶段由静态数据库传入到画布上的，跳过选中环节
      if (isReload === 2 || isReload === 1) {
        // console.log("This function is in special mode.")
        // level_updateCollaborateComponent(this, this.currentPage.page_id, component)
        return
      }


      // 否则，默认选中这一个元素并更新
      this.handleSelect({control: component, needUpdate: 1})
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
          let transform = {...item.transform}
          transform[key] = value
          item.transform = transform
          return item
        } else if (isExtra) {
          let extra = {...item.extra}
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
    handleTransform({transform, type}) {
      this.controlled = {...this.controlled, ...transform}
      if (['resizeend', 'dragend', 'rotateend'].includes(type)) {
        console.log("Detected transform type", type)
        this.updateControlValue('transform', transform, false)
        // 需要将usedBy传入组件中
        // 为了显示美观，这里传入用户名
        this.updateControlValue('usedBy', this.$store.state.user.name, true)

        let realComponent = findComponent(this.controls, (item) => {
          return this.controlled.id === item.id
        })

        console.log("The currently controlled element is", realComponent)
        // 实时协作中，需要更新组件信息
        this.controlled.usedBy = this.$store.state.user.id
        level_updateCollaborateComponent(this, this.currentPage.page_id, realComponent)
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
    handleSelect({control, needUpdate = 0}) {
      console.log("handleSelect called", control.usedBy, this.$store.state.user.id)
      if (!(control.usedBy === '__none__' || control.usedBy === this.$store.state.user.id)) {
        // 被别的用户控制
        // 直接return
        return
      }
      // 标记usedBy标签
      control.usedBy = this.$store.state.user.id

      // 这个函数里把control深拷贝了，不能再用原来的
      this.setCurrentControl(control)
      this.updateControlStatus(true)
      // 在实时协作文档中同步内容
      if (needUpdate) {
        // 拿到深拷贝的当前控件
        let deepCopyCurrentComponent = findComponent(this.controls, (item) => {
          return item.id === control.id
        })
        console.log("Need update when handleSelect ends.", deepCopyCurrentComponent)
        level_updateCollaborateComponent(this, this.currentPage.page_id, deepCopyCurrentComponent)
      }


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
      Object.assign(control, control.transform, {active: true})
      //  将选中组件设置到当前属性编辑器中
      let {path} = findComponentPathById(this.controls, control.id)
      this.currentPath = path
      this.controlled = control
      this.currentId = control.id
    },
    // 属性编辑器变化后同步到组件中
    handleChange({keyName, value, extra}) {
      console.log("hello!", keyName, value, extra)
      if (!this.currentId) {
        return
      }
      if (extra) {
        this.controlled.extra[keyName] = value
      } else {
        this.controlled[keyName] = value
      }
      // 注意节流优化提升性能
      this.updateControlValue(keyName, value, extra)
      level_updateCollaborateComponent(this, this.currentPage.page_id, this.controlled)
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
      console.log("hello")
      if (!this.currentId) {
        return
      }
      let idToDelete = this.controlled.id
      let controls = updateTreeIn(this.controls, this.currentPath, () => false)
      this.setControls(controls)
      this.clearCurrentComponent()
      // 本地删除后，要和远程同步
      level_deleteCollaborateComponent(this, this.currentPage.page_id, idToDelete)
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
      let realComponent = findComponent(this.controls, (item) => {
        return this.currentId === item.id
      })
      realComponent.usedBy = '__none__'
      realComponent.resizable = true
      realComponent.draggable = true
      // 还要在extra属性内更改usedBy
      realComponent.extra.usedBy = '__none__'
      level_updateCollaborateComponent(this, this.currentPage.page_id, realComponent)
      this.updateControlStatus(false)
      this.clearCurrentComponent()
    },
    getEditorView() {
      return this.$refs.editor
    },
    exportControlsJson() {
      _exportControlsJson(this)
    },
    createTemplate(){
      _exportTemplateToBackend(this)
    },
    parseComponentJSON({componentJSON, parentId}) {
      // 第一次调用（在root editor上遍历）首先清除当前画布上所有的控件和所有的当前选中状态
      if (parentId === -1) {
        this.setControls([])
        this.clearCurrentComponent()
      }
      if (componentJSON === "") return
      componentJSON = JSON.parse(componentJSON)
      // console.log("Parent ID:", parentId, "componentJSON:", componentJSON)
      componentJSON = componentJSON['components']
      componentJSON.map((item) => {
        this.addControl({components: [item], parentId: item.parentId, isReload: 1})
        if (item.hasChild === false) {
          // 没有子元素
          // console.log("[ParseJSON] This element has no child component.")
        } else {
          // 有子元素
          let childJSON = item.childrenJSON
          this.parseComponentJSON({componentJSON: childJSON, parentId: item.id})
        }
      })
    },
    handleSwitchPage({newPageFileId}) {
      console.log("Ready to switch new page:", newPageFileId)
      level_switchPage(this, newPageFileId)
    },
    handleSaveImage() {
      getSnapShot("root-editor-view")
    }
  },
  created() {

    // eslint-disable-next-line no-unused-vars
    const MAX_HEIGHT = 750
    // eslint-disable-next-line no-unused-vars
    const MAX_WIDTH = 1000


    eventBus.$on(EVENT_COMPONENT_ADD, this.addControl)
    eventBus.$on(EVENT_COMPONENT_SELECT, this.handleSelect)
    eventBus.$on(EVENT_COMPONENT_TRANSFORM, this.handleTransform)
    eventBus.$on(EVENT_COMPONENT_UNSELECT, this.handleUnselect)
    eventBus.$on(EVENT_COMPONENT_DUPLICATE, this.duplicateComponent)
    eventBus.$on(EVENT_COMPONENT_DELETE, this.deleteComponent)
    eventBus.$on(EVENT_DESIGNER_REDO, this.handleRedo)
    eventBus.$on(EVENT_DESIGNER_UNDO, this.handleUndo)
    eventBus.$on(EVENT_DESIGNER_CLEAR, this.handleClear)

    // 下面的功能，正式部署时要注释掉
    eventBus.$on(COLLABORATE_EXPORT_JSON, this.exportControlsJson)
    eventBus.$on(DEV_CREATE_TEMPLATE, this.createTemplate)


    eventBus.$on(EVENT_DESIGNER_SAVEIMG, this.handleSaveImage)
    eventBus.$on(EVENT_DESIGNER_SWITCH, this.handleSwitchPage)
  },
  async mounted() {
    const IS_LEVELDB = true
    if (IS_LEVELDB) {
      // 从localStorage拿数据
      this.$store.state.file_id = localStorage.getItem('file_id')
      this.$store.state.file_name = localStorage.getItem('file_name')
      this.$store.state.file_index = localStorage.getItem('file_index')
      this.$store.state.user.name = localStorage.getItem('user_name')
      this.$store.state.user.id = localStorage.getItem('user_id')
      console.log("Setting up...")
      this.file_id = this.$store.state.file_id // 原型设计的id
      this.file_name = this.$store.state.file_name  // 原型设计名称
      this.userId = this.$store.state.user.id
      // 只需要一个函数进行初始化
      _level_loadCanvasInit(this)
    } else {
      this.file_id = this.$store.state.file_id // 原型设计的id
      this.file_name = this.$store.state.file_name  // 原型设计名称

      this.currentPage = {
        page_index: 1,
        page_id: "demoPage",
        page_file_id: "demoPrototype",
        page_name: "lalala",
        width: 800,
        height: 800
      }
      this.$store.state.user.id = prompt("输入测试用户名")
      this.$store.state.user.name = this.$store.state.user.id + "---"
      level_getCollaboratePrototype(this, this.currentPage.page_id)
      console.log("[OFFLINE MULTIPAGE]You shouldn't see this in an official release.")
    }
  }
}
</script>

<style lang="less">
@import "./libs/customComponents.css";
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
  .notice-bar{
    border: 1px solid black;
    border-radius: 3px;
    padding-left: 3px;
    padding-right: 3px;
    position: absolute;
    left: 5px;
    top: -25px;
    z-index: 99999;
    height: 20px;
    font-size: 14px;
  }
  .header {
    padding: 0;
  }
  .workpane {
    margin-top: 2vh;
    max-height: 70vh;
    max-width: 70vw;
    overflow-y: scroll;
    overflow-x: scroll;
    padding-left: 0;
  }
  .leftPane {
    margin: 20px 0 0 0;
  }
  .mainPane {
    padding: 0;
    margin: 0 0 0 0;
  }
  .rightPane {
  }
}
</style>
