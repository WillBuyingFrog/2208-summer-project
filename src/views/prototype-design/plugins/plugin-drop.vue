<script>
export default {
  name: "plugin-drop",
  render(){
    return (
        <div class="guide">
          <div>拖拽组件或本地图片到此区域开始编辑</div>
          <div>Drag component or local pictures to this area to start editing</div>
        </div>
    )
  }
}
</script>

<style scoped>
.guide {
  left: 50%;
  top: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
  color: #999;
  line-height: 2;
  font-size: 16px;
  font-weight: 300;
}
</style>
