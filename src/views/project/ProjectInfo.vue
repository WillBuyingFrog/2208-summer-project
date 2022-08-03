<template>
    <div>
        <el-card class="box-card" style="width: 800px">
            <template #header>
                <div class="card-header">
                    <span class="pname">
                        <el-icon><Paperclip /></el-icon>
                        项目信息
                    </span>
                <div class="clear"></div>
                </div>
            </template>
            <div class="text item">
                <el-form :model="file" label-width="140px" label-position="left">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item>
                                <template #label>  
                                    <div class="label1"><el-icon><Collection /></el-icon> 项目名称:</div>
                                </template>
                                <span>{{}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item>
                                <template #label>  
                                    <div class="label1"><el-icon><DocumentCopy /></el-icon> 隶属团队:</div>
                                </template>
                                <span>{{}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
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
                                    <div class="label1"><el-icon><User /></el-icon> 最后编辑者:</div>
                                </template>
                                <span>{{}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item>
                                <template #label>  
                                    <div class="label1"><el-icon><Timer /></el-icon> 最后编辑时间:</div>
                                </template>
                                <span>2022/08/02 21:46{{}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-form-item>
                                <template #label>  
                                    <div class="label1"><el-icon><CollectionTag /></el-icon> 项目简介:</div>
                                </template>
                                <span>{{}}</span>
                            </el-form-item>
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
    </div>
</template>

<script>
export default {
name: "projectFile",
    data() {
        return {
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
.el-card {
    background-color: rgba(255, 255, 255, 0.62);
    border-radius: 1ch;
    box-shadow: 14px 15px 19px -15px #000;
    margin-top:20px;
    margin-left: 15%;
}
.el-form{
    margin-left: 20px;
    margin-right: 20px;
}
</style>