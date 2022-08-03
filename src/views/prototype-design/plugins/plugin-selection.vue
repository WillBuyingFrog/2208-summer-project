<script>
import DDrComponent from "@/views/prototype-design/libs/ddr"

import {EVENT_COMPONENT_UNSELECT} from "@/views/prototype-design/event-enum";
import eventBus from "@/views/prototype-design/utils/eventBus";

import {Interaction} from "@/views/prototype-design/utils/dom";
import {getComponentRef, getComponentRefsById} from "@/views/prototype-design/utils/ref";
import {getBoundingRect} from "@/views/prototype-design/libs/ddr/helper";
import {registerSelectionActions} from "@/views/prototype-design/plugins/plugin-selection-actions";

export default {
  name: "plugin-selection",
  inject:['editorDOM'],
  props: {
    // 从属哪个EditorView（因为可能有container）
    application: Object,
  },
  data() {
    return {
      grid: [1, 1],
      selectedComponents: [],
      selectionTransform: { x: 0, y: 0, width: 0, height: 0, rotation: 0 },
      selectionActive: false,
      selectionHandler: ['tl', 'tr', 'br', 'bl'],
      selectionArea: { x: 0, y: 0, width: 0, height: 0 },
    }
  },
  watch: {
    selectionActive(value) {
      if (!value) {
        this.selectedComponents = []
        this.selectionTransform = { x: 0, y: 0, width: 0, rotation: 0 }
        this.componentRefs = []
      }
    },
  },
  methods: {
    getContains() {
      // rect代表了选择的矩形区域
      const rect = this.selectionArea
      const controls = this.application.controls
      // 遍历当前EditorView中所有的元素，被rect包含的元素才会被选中
      const crossComponents = controls.filter((item) => {
        let transform = getBoundingRect(item.transform)
        let isXContain = transform.left > rect.x && transform.right < rect.x + rect.width
        let isYContain = transform.top > rect.y && transform.bottom < rect.y + rect.height
        return isXContain && isYContain
      })
      // 得出被选择的元素
      this.selectedComponents = crossComponents.map((item) => ({
        id: item.id,
        ...item.transform,
      }))
    },
    handleSelectionStart() {
      eventBus.$emit(EVENT_COMPONENT_UNSELECT)
      this.selectionActive = false
    },
    handleSelectionMove({ x, y, downClientX, downClientY }) {
      if (x < 0) {
        x = Math.abs(x)
        downClientX -= x
      }
      if (y < 0) {
        y = Math.abs(y)
        downClientY -= y
      }
      this.selectionArea = { x: downClientX, y: downClientY, width: x, height: y }
      this.getContains()
    },
    handleSelectionEnd() {
      if (this.selectedComponents.length == 1) {
        this.application.handleSelect(
            this.application.controls.find((item) => item.id === this.selectedComponents[0].id)
        )
        this.selectedComponents = []
      } else if (this.selectedComponents.length > 1) {
        this.application.handleUnselect()
        this.createSelectionTransform()
      }
      this.selectionArea = { x: 0, y: 0, width: 0, height: 0 }
    },
    createSelectionTransform() {
      let x = []
      let y = []
      let x1 = []
      let y1 = []
      let ids = []
      this.selectedComponents.forEach((item) => {
        ids.push(item.id)
        item = getBoundingRect(item)
        x.push(item.left)
        y.push(item.top)
        x1.push(item.right)
        y1.push(item.bottom)
      })
      let left = Math.min(...x)
      let top = Math.min(...y)
      let right = Math.max(...x1)
      let bottom = Math.max(...y1)
      this.selectionActive = true
      this.selectionTransform = {
        x: left,
        y: top,
        width: right - left,
        height: bottom - top,
        rotation: 0,
      }
      this.getSelectedComponentRefs(ids, this.selectionTransform)
    },
    getSelectedComponentRefs(ids, { x, y, width, height }) {
      this.componentRefs = getComponentRefsById(ids).map((item) => {
        // 记录组件在选区的位置和宽度百分比
        item._xPercent = (item.transform.x - x) / width
        item._yPercent = (item.transform.y - y) / height
        item._wPercent = item.transform.width / width
        item._hPercent = item.transform.height / height
        return item
      })
    },
    getSelectedComponentTransform() {
      this.selectedComponents = this.selectedComponents.map((item) => {
        let t = getComponentRef(item.id).transform
        item.x = t.x
        item.y = t.y
        item.width = t.width
        item.height = t.height
        return item
      })
    },
    handleSelectionDrag(e) {
      e.stopPropagation()
      let area = this.$refs.ddr.transform
      this.componentRefs.forEach((item) => {
        item.transform.x = Math.round(area.x + area.width * item._xPercent)
        item.transform.y = Math.round(area.y + area.height * item._yPercent)
      })
      this.getSelectedComponentTransform()
    },
    stopPropagation(e) {
      e.stopPropagation()
    },
    handleSelectionDragEnd(e, transform) {
      e.stopPropagation()
      let changes = {}
      this.componentRefs.forEach((item) => {
        changes[item.id] = {
          key: 'transform',
          value: { ...item.transform },
        }
      })
      this.selectionTransform = transform
      this.application.batchUpdateControlValue(changes)
    },

    handleSelectionResize(e) {
      e.stopPropagation()
      let area = this.$refs.ddr.transform
      this.componentRefs.forEach((item) => {
        item.transform.x = Math.round(area.x + area.width * item._xPercent)
        item.transform.y = Math.round(area.y + area.height * item._yPercent)
        item.transform.width = Math.round(area.width * item._wPercent)
        item.transform.height = Math.round(area.height * item._hPercent)
      })
      this.getSelectedComponentTransform()
    },
  },
  mounted() {
    this.componentRefs = []
    let element = this.editorDOM.value

    Interaction.init(element, {
      onStart: () => {
        this.handleSelectionStart()
      },
      onMove: (interaction) => {
        this.handleSelectionMove(interaction)
      },
      onEnd: () => {
        this.handleSelectionEnd()
      },
    })
    // register
    registerSelectionActions(this)
  },
  render(){
    const { x, y, width, height } = this.selectionArea
    return (
        <div data-plugin="selection" class="plugin-selection">
          <div
              style={`
            display:${width > 0 ? 'block' : 'none'};
            width:${width}px;
            height:${height}px;
            left:${x}px;
            top:${y}px`}
              class="selection-box"
          />
          {this.selectedComponents.map((item) => {
            return (
                <div
                    class="selection-selected-component-bordered"
                    style={`
                transform:rotate(${item.rotation}deg);
                left:${item.x}px;
                top:${item.y}px;
                width:${item.width}px;
                height:${item.height}px`}
                    key={item.id}
                />
            )
          })}

          <DDrComponent
              ref="ddr"
              data-component="true"
              rotatable={false}
              grid={this.grid}
              resizeHandler={this.selectionHandler}
              active={this.selectionActive}
              onDragstart={this.stopPropagation}
              onDrag={this.handleSelectionDrag}
              onDragend={this.handleSelectionDragEnd}
              onResizestart={this.stopPropagation}
              onResize={this.handleSelectionResize}
              onResizeend={this.handleSelectionDragEnd}
              value={this.selectionTransform}
          />
        </div>
    )
  }
}
</script>

<style lang="less" scoped>
.selection-box {
  border: 1px dashed blue;
  background: rgba(255, 255, 255, 0.2);
  display: none;
  position: absolute;
}
.selection-selected-component-bordered {
  border: 1px solid blue;
  position: absolute;
}
</style>
