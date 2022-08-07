<template>
  <div class="bg">
    <el-container>
      <el-header style="padding: 0 0 ;">
        <TopGuide/>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-tree
              :data="data"
              :props="defaultProps"
              accordion
              @node-click="handleNodeClick"
          />
        </el-aside>
        <el-main>

        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import 'element-plus/dist/index.css'
import { ElMessage } from 'element-plus'

export default {
  name: "DocumentCenter",
  data() {
    return {
      team_id: '',
      dialogVisible: false,
      dialogVisible1: false,
      status: "0",
      allproject: [],
      newname: '',
      oldname: '',
      newone:{
        name: "",
        info: "",
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

    getAllProject(){
      this.$axios
          .post('/project/viewAllProject',{
            team_id: this.team_id
          })
          .then(res =>{
            console.log(res.data);
            switch(res.data.code) {
              case 200:
                this.allproject = res.data.data;
                break;
              case 500:
                ElMessage.error(res.data.message);
            }
          })
          .catch(err => {
            console.log(err);
          })

    },
    getTrashProject() {
      this.$axios
          .post("/project/viewTrash", {
            team_id: this.team_id
          })
          .then(res =>{
            console.log(res.data);
            switch(res.data.code) {
              case 200:
                this.allproject = res.data.data;
                break;
              case 500:
                ElMessage.error(res.data.message);
            }
          })
          .catch(err => {
            console.log(err);
          })
    },
    handleClick() {
      this.allproject=[];
      console.log(this.status);
      if(this.status == '1'){
        this.getAllProject();
        console.log('allproject');
      }
      else if(this.status == '0'){
        this.getTrashProject();
        console.log('trashproject');
      }
    },
    newProject(){
      if(this.newone.name == '' || this.newone.name == undefined || this.newone.name == null) {
        ElMessage.warning("请输入项目名称");
      }
      else{
        this.$axios
            .post('/project/new',{
              project_name: this.newone.name,
              team_id: this.team_id,
              project_info: this.newone.info
            })
            .then(res =>{
              console.log(res.data.code);
              console.log(res.data.data);
              switch (res.data.code){
                case 200:
                  this.getAllProject();
                  ElMessage.success("创建成功!");
                  this.newone.name = '';
                  this.newone.info = '';
                  this.dialogVisible = false;
                  break;
                case 500:
                  ElMessage.error(res.data.message);
                  break;
              }
            })
            .catch(err => {
              console.log(err);
            })
      }

    },
    openRename(oldname){
      this.oldname = oldname;
      this.dialogVisible1 = true;
    },
    rename(){
      if(this.newname == '' || this.newname == null || this.newname == undefined){
        ElMessage.warning("重命名不能为空")
      }else{
        this.$http
            .post('/project/rename', {
              team_id: this.team_id,
              original_project_name: this.oldname,
              new_project_name: this.newname
            })
            .then(res =>{
              console.log(res.data.code);
              console.log(res.data.data);
              switch (res.data.code){
                case 200:
                  this.getAllProject();
                  ElMessage.success("重命名成功!");
                  this.newname = '';
                  this.dialogVisible1 = false;
                  break;
                case 500:
                  ElMessage.error(res.data.message);
                  break;
              }
            })
            .catch(err => {
              console.log(err);
            })
      }
    },
    deletePro(project_name){
      this.$http
          .post('/project/remove', {
            project_name: project_name,
            team_id: this.team_id
          })
          .then(res =>{
            console.log(res.data.code);
            console.log(res.data.data);
            switch (res.data.code){
              case 200:
                this.getAllProject();
                ElMessage.success(res.data.message);
                break;
              case 500:
                ElMessage.error(res.data.message);
                break;
            }
          })
          .catch(err => {
            console.log(err);
          })
    },
    recover(project_name){
      this.$http
          .post('/project/recover', {
            project_name: project_name,
            team_id: this.team_id
          })
          .then(res =>{
            console.log(res.data.code);
            console.log(res.data.data);
            switch (res.data.code){
              case 200:
                this.getTrashProject();
                ElMessage.success(res.data.message);
                break;
              case 500:
                ElMessage.error(res.data.message);
                break;
            }
          })
          .catch(err => {
            console.log(err);
          })
    },
    cleanTrash(){
      this.$http
          .post('/project/emptyTrash', {
            team_id: this.team_id
          })
          .then(res =>{
            console.log(res.data.code);
            console.log(res.data.data);
            switch (res.data.code){
              case 200:
                this.getTrashProject();
                ElMessage.success(res.data.message);
                break;
              case 500:
                ElMessage.error(res.data.message);
                break;
            }
          })
          .catch(err => {
            console.log(err);
          })
    },
    toProject(name, id){
      this.$store.state.project_name = name;
      this.$store.state.project_id = id;
      this.$router.push('/projectinfo');
    }
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

</style>
