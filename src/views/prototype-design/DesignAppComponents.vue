
<script>
export default {
  name: "DesignAppComponents",
  data(){
    return {
      // 未来可以单独写一个加载components的功能
      elements: [
        {
          type: 'label',
          value: 'Hi~我是一段文本',
          name: 'Label',
          width: 150,
          height: 30,
        },
        {
          type: 'input',
          value: '输入',
          inputType: 'input',
          name: 'Input',
          width: 150,
          height: 30,
        }
      ]
    }
  },
  render(){
    return (
        <div class="ds-components">
          <span>这里是组件选择页</span>
          <el-row gutter={20}>
            {this.elements.map((item, index) => {
              return (
                  <el-col span={8}>
                    {index}为{item.name}
                  </el-col>
              )
            })}
          </el-row>
        </div>
    )
  }
}
</script>

<style scoped>
.ds-components{
  overflow-y: scroll;
  overflow-x: hidden;
  min-height: 60vh;
}
</style>
