<template>
    <div>
    <el-space direction="vertical">
            <el-card v-for="i in proNum" :key="i" class="box-card" style="width: 900px">
                <div class="card-header">
                    <span class="pname">
                        <el-icon v-if="fileType == 1"><EditPen /></el-icon>
                        <el-icon v-if="fileType == 2"><Document /></el-icon>
                        <el-icon v-if="fileType == 3"><Picture /></el-icon>
                        {{}}文件名
                    </span>
                    <el-button size="small">编辑</el-button>
                    <el-button size="small">重命名</el-button>
                    <el-button size="small">查看</el-button>
                    <div class="clear"></div>
                <el-button class="button" type="primary" plain v-if="status==0">进入项目</el-button>
                <div class="clear"></div>
                </div>
            <div class="text item">
                <el-form :model="file" label-width="140px" label-position="left">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item>
                                <template #label>  
                                    <div class="label1"><el-icon><Avatar /></el-icon> 创建者:</div>
                                </template>
                                <span>{{}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item>
                                <template #label>  
                                    <div class="label1"><el-icon><Timer /></el-icon> 创建时间:</div>
                                </template>
                                <span>{{}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item>
                                <template #label>  
                                    <div class="label1"><el-icon><Timer /></el-icon> 最后编辑时间:</div>
                                </template>
                                <span>2022/08/02 21:46{{}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item>
                                <template #label>  
                                    <div class="label1"><el-icon><User /></el-icon> 最后编辑者:</div>
                                </template>
                                <span>{{}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>   
                    <div class="button1" v-if="status == 0">
                        <el-button type="primary" @click="rename">重命名</el-button>
                        <el-button type="danger" @click="deletePro">删&nbsp;除</el-button> 
                    </div>  
                    <div class="button1" v-if="status == 1">
                        <el-button type="danger" @click="recover">恢&nbsp;复</el-button>    
                    </div>                                      
                </el-form>
            </div>
        </el-card>
    </el-space>
    </div>
</template>

<script>
export default {
    name: "projectFile",
    data() {
        return {
            fileType: "1",
            dialogVisible: false,
            file: {},
            firstChar: "S",//用户名首字母
            proNum: 4,//项目总数
            newone:{
                name: "",
                info: ""
            }
        }
    },
    methods: {
        newTeam(){
            this.dialogVisible = false;
        }
    }

}

</script>

<style scoped>
.el-space {
    margin-left: 10%;
    margin-right: 5%;
}
.el-card {
    background-color: rgba(255, 255, 255, 0.62);
    border-radius: 1ch;
    box-shadow: 14px 15px 19px -15px #000;
    margin-top:20px;
}
.el-form {
    padding-left: 20px;
    padding-right: 20px;
    padding-top:5px
}
.el-row{
    height: 30px;
}
.pname{
    font-size: 18px;
    float: left;
    font-weight: 520;
}
.clear{
    clear: both;
}
.card-header .el-button{
    float: right;
    margin-right: 20px;
}
.card-header{
    border-bottom: 1px solid #D3D3D3;
    padding-bottom: 6px;
}
</style>