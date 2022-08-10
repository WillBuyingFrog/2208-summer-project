<script>
import eventBus from "@/views/prototype-design/utils/eventBus";
import {
  EVENT_COMPONENT_DELETE,
  EVENT_DESIGNER_SAVEIMG, EVENT_DESIGNER_RESIZE, EVENT_COMPONENT_DUPLICATE,
  COLLABORATE_EXPORT_JSON, DEV_CREATE_TEMPLATE
} from "@/views/prototype-design/event-enum";

export default {
  name: "DesignAppHeader",
  inject: ['pages'],
  data(){
    return {
      expr_width: 100,
      expr_height: 95
    }
  },
  methods: {
    handleResizeRequest(alterHeight, alterWidth){
      this.expr_height = (alterHeight + this.expr_height >= 95) ? 95 : (alterHeight + this.expr_height)
      this.expr_width = (alterWidth + this.expr_width >= 100) ? 100 : (alterWidth + this.expr_width)
      let newHeight = this.expr_height.toString() + "%"
      let newWidth = this.expr_width.toString() + "%"
      let newMargin = (100 - this.expr_width) / 2
      newMargin = newMargin.toFixed(4)
      let newMarginText = newMargin.toString() + "%"
      eventBus.$emit(EVENT_DESIGNER_RESIZE, {newWidth: newWidth, newHeight: newHeight, margins:newMarginText})
    }
  },
  /**
   * <el-icon
   className="icon-contain"
   onClick={() => eventBus.$emit(COLLABORATE_EXPORT_JSON)}
   >
   <Upload class="icon"/>
   </el-icon>
   * <el-icon className="icon-contain" onClick={() => eventBus.$emit(DEV_CREATE_TEMPLATE)}>
   <Delete class="icon"></Delete>
   </el-icon>

   * @returns {JSX.Element}
   */
  render: function () {
    return (
        <div class="ds-header">
          <el-space>
            <el-icon
                className="icon-contain"
                onClick={() => eventBus.$emit(COLLABORATE_EXPORT_JSON)}
            >
              <Upload class="icon"/>
            </el-icon>
          <el-icon
              className="icon-contain"
              onClick={() => eventBus.$emit(EVENT_COMPONENT_DELETE)}
          >
            <Delete class="icon"></Delete>
          </el-icon>
          <el-icon
              className="icon-contain"
              onClick={() => eventBus.$emit(EVENT_COMPONENT_DUPLICATE)}
          >
            <DocumentCopy class="icon"></DocumentCopy>

          </el-icon>
          <el-icon
              className="icon-contain"
              onClick={() => eventBus.$emit(EVENT_DESIGNER_SAVEIMG)}
          >
            <Download class="icon"></Download>
          </el-icon>
              <el-icon className="icon-contain" onClick={() => eventBus.$emit(DEV_CREATE_TEMPLATE)}>
              <Delete class="icon"></Delete>
            </el-icon>
          </el-space>
        </div>
    )
  }
}
</script>

<style scoped>
.ds-header{
  height: 50px;
  margin: 20px 10px 0 10px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.50);
  box-shadow: 3px 3px 10px #bebebe;
  padding: 0;
}
.icon-contain {
  margin: 0 10px 0 10px;
}
.icon {
  width: 25px;
  height: 25px;
  margin-top: 10px;
}
.icon-contain :hover {
  color: #999999;
}
.page-switch-button{
  box-shadow: rgb(24, 49, 83) 0 6px 0 0;
  box-sizing: border-box;
  border: 2px solid rgb(24, 49, 83);
  border-radius: 6px;
  cursor: pointer;

  height: 100%;
  min-width: 60px;
}
.page-switch-button:active{
  box-shadow: rgb(24, 49, 83) 0 1px 0 0;
  margin: 5px 0 0 0;
}
</style>
