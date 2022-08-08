<script>
import eventBus from "@/views/prototype-design/utils/eventBus";

import ComponentImpl from "@/views/prototype-design/component-impl"

import {saveComponentRef} from "@/views/prototype-design/utils/ref";

import DragCell from 'yoyoo-ddr-vue3'
import 'yoyoo-ddr-vue3/dist/yoyoo-ddr-vue3.css'

import {
  EVENT_COMPONENT_SELECT,
  EVENT_COMPONENT_TRANSFORM
} from "@/views/prototype-design/event-enum"

export default {
  name: "cell-wrapper",
  props: {
    // 一个cell wrapper包裹着一个DDR，可以显示一种元素
    // item以json形式包含了一系列显示需要的样式，便于后期拓展
    item: Object,
  },
  methods: {

    /**
     * 变换事件处理函数。将通过eventBus发起EVENT_COMPONENT_TRANSFORM，让root editor知晓变动并做出相应
     * @param e 事件对象
     * @param transform 变换
     */
    handler(e, transform) {
      e.stopPropagation() // 停止事件传播（？）
      e.preventDefault() // 取消事件默认行为
      // 使用eventBus发起全局事件
      // console.log("Generated transform:", transform)
      eventBus.$emit(EVENT_COMPONENT_TRANSFORM, { type: this.handleType, transform })
    },
    beforeActive1() {
      this.handleType = 'beforeactive'
      eventBus.$emit(EVENT_COMPONENT_SELECT, {control: this.item, needUpdate: 1})
      return true
    },
    // 以下是一系列拖拽、旋转、变大小等操作的
    handleDragStart(e, t) {
      this.handleType = 'dragstart'
      this.handler(e, t)
    },
    handleDrag(e, t) {
      this.handleType = 'drag'
      this.handler(e, t)
    },
    handleDragEnd(e, t) {
      this.handleType = 'dragend'
      this.handler(e, t)
    },
    handleResizeStart(e, t) {
      this.handleType = 'resizestart'
      this.handler(e, t)
    },
    handleResize(e, t) {
      this.handleType = 'resize'
      this.handler(e, t)
    },
    handleResizeEnd(e, t) {
      this.handleType = 'resizeend'
      this.handler(e, t)
    },
    handleRotateStart(e, t) {
      this.handleType = 'rotatestart'
      this.handler(e, t)
    },
    handleRotate(e, t) {
      this.handleType = 'rotate'
      this.handler(e, t)
    },
    handleRotateEnd(e, t) {
      this.handleType = 'rotateend'
      this.handler(e, t)
    },
    /**
     * 返回该元素渲染的部分。
     * 每种元素渲染的内容在ComponentImpl中声明。
     * @returns {JSX.Element}
     */
    renderContent() {
      let extra = this.item.extra
      let DynamicComponent = ComponentImpl[extra.type]
      return (
          <div class="component-impl">
            <DynamicComponent meta={this.item} params={extra} />
          </div>
      )
    },
  },
  mounted() {
    // 保存组件的引用，方便直接对组件进行操作
    saveComponentRef(this.item.id, this.$refs.cell)
  },
  render() {
    let item = this.item
    return (
        <DragCell
            ref="cell"
            data-component={true}
            grid={item.grid}
            axis={item.axis}
            key={item.id}
            id={item.id}
            draggable={item.draggable}
            rotatable={false}
            resizable={item.resizable}
            parent={item.parent}
            acceptRatio={item.acceptRatio}
            resizeHandler={item.resizeHandler}
            minWidth={item.minWidth}
            minHeight={item.minHeight}
            active={item.active}
            value={item.transform}
            zoom={item.zoom}
            beforeActive={this.beforeActive1}
            onDragstart={this.handleDragStart}
            onDrag={this.handleDrag}
            onDragend={this.handleDragEnd}
            onResizestart={this.handleResizeStart}
            onResize={this.handleResize}
            onResizeend={this.handleResizeEnd}
            onRotatestart={this.handleRotateStart}
            onRotate={this.handleRotate}
            onRotateend={this.handleRotateEnd}
            renderContent={this.renderContent}
        />
    )
  },
}
</script>

<style lang="less" scoped>
.component-impl {
  position: absolute;
  user-select: none;
}
</style>
