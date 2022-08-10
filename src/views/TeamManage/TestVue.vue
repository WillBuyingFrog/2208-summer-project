<template>
    <el-container >
      <el-header style="background: rgb(240,240,240);">
        <el-row >
            <el-col :span="2">
            <span style="float:left;margin-left:30px;"> <img src="../../assets/images/logo-1.png" height="58"/></span>    
            </el-col>
            <el-col :span="18">
                <h2>原型设计名字</h2>
            </el-col>
            <el-col :span="4">
                <el-button @click="toggleFullscreen">全屏预览</el-button>
            </el-col>
        </el-row>
      </el-header>
      <el-container>
        <el-aside width="300px" style="background: rgb(240,240,240);height:100vh;">
            <h4>页面（{{list.length}}）</h4>
            <el-divider></el-divider>
            <el-table :data="list" style="width: 100%;background-color:transparent;" 
                :show-header="false"  row-style="background:transparent; height:50px"
                @row-click = change highlight-current-row="true">
                <el-table-column>
                    <template #default="scope">
                       <el-icon><CopyDocument /></el-icon>
                        <span style="font-size:15px; margin-left:10px"> {{scope.row.name}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-aside>
        <el-main>
            <el-image :src="src" style="height:630px;" id="img"></el-image>
        </el-main>
      </el-container>
    </el-container>
    <!-- <el-container >
        <el-image :src="src" style="height:100%;"></el-image>
    </el-container> -->
</template>

<script>
import screenfull from 'screenfull'
export default{
    data(){
        return{
            list:[{
                name:'首页',
                url:'blob:http://localhost:8080/f906ec4e-5afd-4223-b62c-6103232836f5',
            },{
                name:'登录、注册页',
                url:'https://img2.baidu.com/it/u=2841427495,874700757&fm=253&fmt=auto&app=120&f=GIF?w=1017&h=800',
            },{
                name:'团队管理页',
                url:'https://img1.baidu.com/it/u=3969247811,1285706727&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400',
            },{
                name:'工作空间',
                url:'https://img0.baidu.com/it/u=1546227440,2897989905&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500',
            },{
                name:'个人信息',
                url:'https://img2.baidu.com/it/u=1061245231,4112198693&fm=253&fmt=auto&app=138&f=JPEG?w=438&h=340',
            }],
            src:'blob:http://localhost:8080/f906ec4e-5afd-4223-b62c-6103232836f5',
        }
    },
    methods: {
        change(row){
           this.src = row.url;
        },
        toggleFullscreen() {
            if (screenfull.isEnabled) {
                const ele = document.getElementById('img');
                screenfull.toggle(ele)
                
            }
        }
    },
   
}

</script>


<style scoped>

</style>