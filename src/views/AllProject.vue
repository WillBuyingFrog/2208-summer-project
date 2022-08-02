<template>
  <div class="workspace">
    <el-container>
      <el-header>
      </el-header>
      <el-main>
        <el-tabs v-model="status" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane label="所有项目" name="0"></el-tab-pane>
            <el-tab-pane label="回收站" name="1"></el-tab-pane>
        </el-tabs>
        <el-space wrap size="large">
            <el-card :key="i" class="box-card" style="width: 300px">
                <template #header>
                    <div class="card-header">
                        <span class="pname">
                            <DocumentCopy style="width: 0.8em; height: 0.8em;"/>
                            新建项目
                        </span>
                    <div class="clear"></div>
                    </div>
                </template>
                <div class="new">
                    <el-button @click="dialogVisible = true">
                        <div><Plus style="width: 1em; height: 1em;"/></div>
                    </el-button>
                </div>
                <div class="hint">快来创建新项目吧！</div>
            </el-card>
            <el-card v-for="i in proNum" :key="i" class="box-card" style="width: 300px">
                <template #header>
                    <div class="card-header">
                        <span class="pname">
                            <User style="width: 0.8em; height: 0.8em;"/>
                            <User style="width: 0.5em; height: 0.5em; margin-left:-6px"/>
                            {{}}
                        </span>
                    <el-button class="button" type="primary" plain>进入团队</el-button>
                    <div class="clear"></div>
                    </div>
                </template>
                <div class="text item">
                    <el-form :model="project" label-width="120px" label-position="left">
                        <el-form-item>
                            <template #label>  
                                <div class="label1"><el-icon><Avatar /></el-icon> 组长:</div>
                            </template>
                            <span>{{}}</span>
                        </el-form-item>
                        <el-form-item>
                            <template #label>  
                                <div class="label1"><el-icon><User /></el-icon> 成员:</div>
                            </template>
                            <span>{{}}</span>
                        </el-form-item>      
                        <el-form-item>
                            <template #label>  
                                <div class="label1"><el-icon><Timer /></el-icon> 创建时间:</div>
                            </template>
                            <span>{{}}</span>
                        </el-form-item>
                        <el-form-item>
                            <template #label>  
                                <div class="label1"><el-icon><InfoFilled /></el-icon> 团队简介:</div>
                            </template>
                            <span>{{}}</span>
                        </el-form-item>                     
                    </el-form>
                </div>
            </el-card>
            <div class="clear"></div>
        </el-space>
      </el-main>
    </el-container>
  </div>
</template>

<script>

export default {
    name: "allProject",
    data() {
        return {
            status: "0",
            proNum: 4,
            project:{},
            newpro:{

            }
        }
    },
    methods: {
        
    }

}

</script>

<style scoped>
.workspace {
  background-image: url("../assets/images/homepage_bk.png");
  background-repeat: repeat-y;
  min-height: 800px;
  overflow: hidden;
  background-position:center;
  background-size: 100% auto;
}
.workspace .el-header{
    height: 67px;
    padding: 0;
    border-bottom: 1px solid #EFEFEF;
    background-color: rgba(255, 255, 255, 0.62);
}
.el-tabs{
    width: 150px;
    margin-left: 50px;
}
.logo {
    padding-top: 15px;
    padding-left: 10px;
}
.el-space {
    float: left;
    padding-left: 12%;
}
.el-card {
    margin: 30px 30px 0 30px;
    background-color: rgba(255, 255, 255, 0.62);
    border-radius: 1ch;
    box-shadow: 14px 15px 19px -15px #000;
}
.el-card .el-form{
    margin-left: 15px;
}
.el-dialog .el-form{
    margin-left:50px;
    margin-right: 100px;
}
.dialog-footer {
    float: calc();
}
.title{
    width: 120px;
    margin-left: 50px;
    margin-top: 20px;
    padding-bottom: 5px;
    font-size: 22px;
    color: rgb(64,158,255);
    border-bottom:4px solid  rgb(64,158,255);
    font-weight: 600;
    float: left;
    }
.head{
    border-radius: 100%;
    background-color:  rgb(64,158,255);
    width: 40px;
    height: 40px;
    margin: 15px;
    font-size: 35px;
    color: white;
    text-align: center;
    margin-right: 30px;
}
.headleft{
    float: right;
}
.label1{
    font-size: 16px;
}
.clear{
    clear: both;
}
.pname{
    font-size: 25px;
    float: left;
    font-weight: 600;
}
.button{
    float: right;
}
.new .el-button{
    margin-top:20px;
    margin-bottom: 30px;
    height: 120px;
    width: 120px;
}

.hint{
    margin-bottom: 10px;
}
</style>
