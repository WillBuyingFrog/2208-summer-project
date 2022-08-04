<script>
import eventBus from "@/views/prototype-design/utils/eventBus";
import {
  EVENT_COMPONENT_DELETE,
  EVENT_COMPONENT_DUPLICATE,
  EVENT_DESIGNER_UNDO,
  EVENT_DESIGNER_REDO,
  EVENT_DESIGNER_CLEAR,
  // COLLABORATE_EXPORT_JSON,
  EVENT_DESIGNER_SAVEIMG
} from "@/views/prototype-design/event-enum";

export default {
  name: "DesignAppHeader",
  render(){
    return (
        <div class="ds-header">
          <el-icon
              class="icon-contain"
              onClick={() => eventBus.$emit(EVENT_COMPONENT_DELETE)}
          >
            <Delete class="icon"></Delete>
          </el-icon>
          <el-icon
              class="icon-contain"
              onClick={() => eventBus.$emit(EVENT_DESIGNER_UNDO)}
          >
            <RefreshLeft class="icon"></RefreshLeft>
          </el-icon>
          <el-icon
              class="icon-contain"
              onClick={() => eventBus.$emit(EVENT_DESIGNER_REDO)}
          >
            <RefreshRight class="icon"></RefreshRight>
          </el-icon>
          <el-icon
              class="icon-contain"
              onClick={() => eventBus.$emit(EVENT_COMPONENT_DUPLICATE)}
          >
            <CopyDocument class="icon"></CopyDocument>
          </el-icon>
          <el-icon
              class="icon-contain"
              onClick={() => eventBus.$emit(EVENT_DESIGNER_CLEAR)}
          >
            <DocumentDelete class="icon"></DocumentDelete>
          </el-icon>
          <el-icon
              class="icon-contain"
              onClick={() => eventBus.$emit(EVENT_DESIGNER_SAVEIMG)}
          >
            <Download class="icon" ></Download>
          </el-icon>
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
  width: 40px;
  height: 40px;
  margin: 5px 10px 0 10px;
}
.icon {
  width: 25px;
  height: 25px;
}
.icon-contain :hover {
  color: #999999;
}
</style>
