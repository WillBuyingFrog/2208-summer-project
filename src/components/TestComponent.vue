<template>
  <el-space direction="vertical">
    <span>
      这是第一个测试组件。
    </span>
    <el-button type="primary" plain>
      测试按钮1
    </el-button>
  </el-space>
  <div class="text item">
                    <el-form :model="project" label-width="80px">
                        <el-form-item label="活动名称:">
                            <span>{{project.project_name}}</span>
                        </el-form-item>                       
                    </el-form>
                </div>
</template>

<script>
export default {
  name: "TestComponent",
  data() {
        return {
            firstChar: "S",//用户名首字母
            project:{
                project_name: "123"
            },
            proNum: 3,//项目总数
        }
  },
}
</script>

<style scoped>

</style>