<template>
  <div class="bg">
    <el-container>
      <el-header style="padding: 0 0 ;">
        <TopGuide/>
      </el-header>
      <el-container>
        <el-aside
            width="300px"
            style="background-color: rgba(250, 250, 250, 0.5);"
        >
          <span></span>
          <el-icon
              style="padding: 20px 0 0 0;font-size: 20px"
              @click="dialogVisible=true"
          ><Plus /></el-icon>
          <el-dialog
              v-model="dialogVisible"
              width="35%">
            <template #header>
              <div class="card-header">
                        <span class="title" style="margin-left: 10px; color: black">
                            <DocumentCopy style="width: 0.8em; height: 0.8em;"/>
                            新建文件夹/文档
                        </span>
                <div class="clear"></div>
              </div>
            </template>
            <el-form :model="newone" label-width="80px">
              <el-form-item label="项目名称">
                <el-input v-model="newone.name"></el-input>
              </el-form-item>
              <el-form-item label="项目简介">
                <el-input type="textarea" maxlength="200" show-word-limit
                          resize="none" :autosize="{ minRows: 6}" v-model="newone.info" style="width:400px"></el-input>
              </el-form-item>
            </el-form>
            <template #footer>
        <span class="dialog-footer">
            <span>
            <el-button @click="dialogVisible = false">取消</el-button>
            <span class="button2" style="margin-left:20px;">
            <el-button @click="newFile" color="#859dda" class="new_btn">立即创建</el-button>
            </span>
            </span>
            <div class="clear"></div>
        </span>
            </template>
          </el-dialog>
          <el-tree
              :data="data"
              :props="defaultProps"
              accordion
              @node-click="handleNodeClick"
              class="tree"
              style="padding: 10px 20px 0 20px;"
          >
          </el-tree>
        </el-aside>
        <el-main>

        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import 'element-plus/dist/index.css'

export default {
  name: "DocumentCenter",
  data() {
    return {
      team_id: '',
      dialogVisible: false,
      allFile: [],
      newone:{
        name: "",
        type: "",
        father: "",
      },
      data: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 2',
        children: [{
          label: '二级 2-1',
          children: [{
            label: '三级 2-1-1'
          }]
        }, {
          label: '二级 2-2',
          children: [{
            label: '三级 2-2-1'
          }]
        }]
      }, {
        label: '一级 3',
        children: [{
          label: '二级 3-1',
          children: [{
            label: '三级 3-1-1'
          }]
        }, {
          label: '二级 3-2',
          children: [{
            label: '三级 3-2-1'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    };
  },
  created(){
    this.team_id = this.$store.state.teamid;
    console.log("team_id: "+this.team_id);
  },
  methods: {
    handleNodeClick(data) {
      console.log(data);
    },
  },
}

</script>

<style scoped>
.bg {
  background-image: url("../../assets/images/bg.jpg");
  background-repeat: repeat-y;
  min-height: 800px;
  background-position:center;
  background-size: 100% auto;
  width: 100%;
  height: 100%;
  position: fixed;
  overflow: auto;
}
.tree {
  background-color: rgba(250, 250, 250, 0);
  height: 100vh;
}
.new_btn {
  color: #FFFFFF;
}

</style>
