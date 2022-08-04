<script>
import eventBus from "@/views/prototype-design/utils/eventBus";
import {
  EVENT_COMPONENT_DELETE,
  EVENT_COMPONENT_DUPLICATE,
  EVENT_DESIGNER_UNDO,
  EVENT_DESIGNER_REDO,
  EVENT_DESIGNER_CLEAR,
  COLLABORATE_EXPORT_JSON,
  EVENT_DESIGNER_SAVEIMG
} from "@/views/prototype-design/event-enum";

export default {
  name: "DesignAppHeader",
  render(){
    return (
        <div class="ds-header">
          <el-button
              title="删除选定的组件"
              onClick={() => eventBus.$emit(EVENT_COMPONENT_DELETE)}
          >
            删除选定的组件
          </el-button>
          <el-button
            title="撤销操作"
            onClick={() => eventBus.$emit(EVENT_DESIGNER_UNDO)}
            >
            撤销
          </el-button>
          <el-button
              title="重做操作"
              onClick={() => eventBus.$emit(EVENT_DESIGNER_REDO)}
          >
            重做
          </el-button>
          <el-button
              title="复制组件"
              onClick={() => eventBus.$emit(EVENT_COMPONENT_DUPLICATE)}
          >
            复制组件
          </el-button>
          <el-button
              title="清屏"
              onClick={() => eventBus.$emit(EVENT_DESIGNER_CLEAR)}
          >
            清屏
          </el-button>
          <el-button
              title="导出JSON"
              onClick={() => eventBus.$emit(COLLABORATE_EXPORT_JSON)}
          >
            导出当前画布的JSON
          </el-button>
          <el-button
              title="导出图片"
              onClick={() => eventBus.$emit(EVENT_DESIGNER_SAVEIMG)}
          >
            导出当前画布为图片
          </el-button>
        </div>
    )
  }
}
</script>

<style scoped>
.ds-header{
  height: 8vh;
  margin: 1vh 0 1vh 0;
}
.ds-header-text{
  font-size: 28px;
}
</style>
