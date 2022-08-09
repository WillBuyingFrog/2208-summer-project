<template>
    <div >
        <el-header height="80px">
            <el-row>
                <el-col :span="2">
                    <span > 
                        <img src="../../assets/images/logo.png" height="80"/>
                    </span>    
                    <el-divider style="float:right;height:40px;margin-top:10px;margin-right:20px;" direction="vertical" />
                </el-col>
                <el-col :span="1">
                    <span style="font:640 26px ''; line-height:70px;">墨 书</span>
                </el-col>
                <el-col :span="18">
                    <span  style="font:550 23px ''; line-height:70px; letter-spacing: 0.15cm;">免费的软工团队协作与管理平台</span>
                </el-col>
                <el-col :span="3">
                    <el-button
                        id="sign-in-button"
                        color="rgb(133,157,218)"
                        @click="gotoLogin"
                        :dark="isDark"
                        style="border-radius: 12px;height:40px;margin-top:20px;font-size:17px"
                        plain>
                        免费使用</el-button>
                </el-col>
            </el-row>
        </el-header>
        <div class="bg">
        <div  class="shell">
            <el-row>
                <el-col :span="6">
                    <el-card  class="card1">
                        <div style="height:120px">
                            <img src="../../assets/icon/1.png"   />
                        </div>
                        <div class="line1">
                            团队工作平台
                        </div>
                        <div class="line2">
                            软工开发团队的协作与管理平台，以项目为单位进行开发，团队成员共享设计资源
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card  class="card1">
                        <div style="height:120px">
                            <img src="../../assets/icon/2.png"   />
                        </div>
                        <div class="line1">
                            专业原型设计
                        </div>
                        <div class="line2">
                            包含丰富的素材，拖拽即可用，轻松上手，支持预览，获取用户产品体验反馈
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card  class="card1">
                        <div style="height:120px">
                            <img src="../../assets/icon/3.png"   />
                        </div>
                        <div class="line1">
                            快速文档编辑
                        </div>
                        <div class="line2">
                            提供多种文档模板，供用户编辑和使用，可导出为多种格式的文件，设立文档中心方便管理
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card  class="card1">
                        <div style="height:120px">
                            <img src="../../assets/icon/4.png"   />
                        </div>
                        <div class="line1">
                            高效协同工作
                        </div>
                        <div class="line2">
                            原型设计、文档编辑均实现多人协同编辑，云端实时存储，提升团队协作效能
                        </div>
                    </el-card>
                </el-col>
            </el-row>      
        </div>
        <div class="moshu">
            <span style="--i:1">墨 </span>
            <span style="--i:2">书 </span>
            <span style="--i:3">M </span>
            <span style="--i:4">O </span>
            <span style="--i:5">S </span>
            <span style="--i:6">H </span>
            <span style="--i:7">U </span>
        </div>
        <el-button
                id="sign-in-button"
                color="rgb(133,157,218)"
                @click="gotoLogin"
                :dark="isDark"
                style="border-radius:24px;height:80px;width:150px;
                font-size:25px;margin-top:70px;left:45% ;"
                plain>
                免费使用</el-button>   
        
        <el-card  class="card3">
            <el-row style="height:100%">
                <el-col :span="10" style="margin-top:20px">
                    <div class="line1">
                        <span style="color:#F56C6C">团队</span>
                        <span>的工作平台</span>
                    </div>
                    <ul class="list">
                        <li>直观的团队成员管理界面</li>
                        <li>以项目为单位进行开发</li>
                        <li>便捷的项目管理操作</li>
                        <li>团队成员共享设计资源</li>
                    </ul>
                    <div>
                    <el-button
                        id="sign-in-button"
                        color="rgb(133,157,218)"
                        @click="gotoLogin"
                        :dark="isDark"
                        style="border-radius:20px;height:50px;width:120px;
                        font-size:20px;"
                        plain>
                        免费使用</el-button>  </div>
                </el-col>
                <el-col :span="14">
                    <el-carousel  height="400px">
                        <el-carousel-item v-for="item in p1" :key="item">
                        <img v-bind:src="item.url" style="width: 100%;height: 100%">
                        </el-carousel-item>
                    </el-carousel>
                </el-col >
            </el-row>
        </el-card>
        <el-card  class="card3">
            <el-row style="height:100%">
                <el-col :span="14">
                    <el-carousel :interval="4000" height="400px" type="card">
                        <el-carousel-item v-for="item in p1" :key="item">
                        <img v-bind:src="item.url" style="width: 100%;height: 100%">
                        </el-carousel-item>
                    </el-carousel>
                </el-col >
                <el-col :span="10" style="margin-top:20px">
                    <div class="line1">
                        <span>专业</span>
                        <span style="color:#F56C6C">原型</span>
                        <span>设计</span>
                    </div>
                    <ul class="list">
                        <li>快速高效，创作自如</li>
                        <li>组件丰富，素材拖拽即可用</li>
                        <li>提供多个不同尺寸的设计模板</li>
                        <li>可导出为图片，可在线预览</li>
                    </ul>
                    <el-button
                        id="sign-in-button"
                        color="rgb(133,157,218)"
                        @click="gotoLogin"
                        :dark="isDark"
                        style="border-radius:20px;height:50px;width:120px;
                        font-size:20px; z-index: 2;"
                        plain>
                        免费使用</el-button> 
                </el-col>
                
            </el-row>
        </el-card>
        <el-card  class="card3">
            <el-row style="height:100%">
            <el-col :span="10" style="margin-top:20px">
                    <div class="line1">
                        <span>快速</span>
                        <span style="color:#F56C6C">文档</span>
                        <span>编辑</span>
                    </div>
                    <ul class="list">
                        <li>优秀的文本编辑器，实时渲染</li>
                        <li>提供多种实用的文档模板</li>
                        <li>可导出为多种形式的文件</li>
                        <li>文档中心统一管理项目文件</li>
                    </ul>
                    <el-button
                        id="sign-in-button"
                        color="rgb(133,157,218)"
                        @click="gotoLogin"
                        :dark="isDark"
                        style="border-radius:20px;height:50px;width:120px;
                        font-size:20px; z-index: 2;"
                        plain>
                        免费使用</el-button> 
                </el-col>
                <el-col :span="14">
                    <el-carousel height="400px" direction="vertical" >
                        <el-carousel-item v-for="item in p1" :key="item">
                        <img v-bind:src="item.url" style="width: 100%;height: 100%">
                        </el-carousel-item>
                    </el-carousel>
                </el-col >
            </el-row>
        </el-card>
        <el-card  class="card3">
            <el-row style="height:100%">
                <el-col :span="14">
                    <el-carousel arrow="always" height="400px">
                        <el-carousel-item v-for="item in p1" :key="item">
                        <img v-bind:src="item.url" style="width: 100%;height: 100%">
                        </el-carousel-item>
                    </el-carousel>
                </el-col >
                <el-col :span="10" style="margin-top:20px">
                    <div class="line1">
                        <span>高效</span>
                        <span style="color:#F56C6C">协同</span>
                        <span>工作</span>
                    </div>
                    <ul class="list">
                        <li>编辑内容实时同步</li>
                        <li>云端实时存储，不怕丢失</li>
                        <li>多人协同编辑，团队协作</li>
                    </ul>
                    <el-button
                        id="sign-in-button"
                        color="rgb(133,157,218)"
                        @click="gotoLogin"
                        :dark="isDark"
                        style="border-radius:20px;height:50px;width:120px;
                        font-size:20px; z-index: 2;"
                        plain>
                        免费使用</el-button> 
                </el-col>
                
            </el-row>
        </el-card>
        <div style="height:200px">

        </div>

        
     </div>
     
    </div>
</template>


<script>
    export default {
        data(){
            return{
              p1:[
                {url:require('../../assets/home/1-1.png')},
                {url:require('../../assets/home/1-2.jpg')},
              ]
            }
        },
        methods:{
            gotoLogin() {
                this.$router.push('/login');
            },
        },
    }
</script>
<style scoped>
    .bg{
         background-image: url("../../assets/images/3.jpg");
        background-position:center;
        background-size: 100% auto;
        width: 100%;
        height: 100%;
        position: fixed;
        overflow: auto;
    }
    .moshu{
    margin-top: 20px;
    left: 35%;
    font: 500 100px '';
    color: #333;
    cursor: pointer;
    }
    .moshu span{
    transition: 1.5s;
    transition-delay: calc(var(--i)*.1s);
    }
    .moshu:hover span{
    color: #fff;
    text-shadow: 0 0 3px gray,
    0 0 20px #fff,
    0 0 30px #fff,
    0 0 50px #fff,
    0 0 80px #fff;
    }
   
    .shell{
        height: 400px;
        width: 1350px;
        margin-top:70px;
        left:10%;
        justify-content: center;
        position: relative;
        display: flex;
        flex-wrap: wrap;
        /* 设置3d变化 */
        transform-style: preserve-3d;
        /* 添加透视效果 */
        perspective: 900px;
    }
    .shell .card1{
        position: relative;
        transition: 0.2s;
        overflow: hidden;
        transform: rotateY(0deg);
        transition-delay: .1s;
        height: 350px;
        width: 300px;
        margin-left: 30px;
        background:rgba(255, 255, 255, .9);
        border-radius: 5px;
        box-shadow: 0 25px 40px rgba(0, 0, 0, 0.7);
    }
    .shell:hover .card1 {
        transform: rotateY(0deg);
    }
    /* 当鼠标悬浮在当前卡片上时，当前卡片的翻转角度为0，
    并放大一点二五倍，加个阴影 */
    .shell .card1:hover {
        transform: rotateY(0deg) scale(1.1);
        box-shadow: 0 25px 40px rgba(0, 0, 0, 0.7);
        z-index: 1;
    }

    /* 当鼠标悬浮在卡片上时，
    当前卡片后面的所有卡片全部都反向翻转负20度 */
    .shell .card1:hover~.card1 {
        transform: rotateY(0deg);
    }

    .line1{
        font: 600 28px '';
        line-height:70px;
        letter-spacing: 0.1cm;
    }
    .line2{
        font: 540 18px '';
        line-height: 26px;
    }
    .card3{
        height: 450px;
        width: 1500px;
        margin-top: 60px;
        margin-left: 100px;
        background:rgba(255, 255, 255, .9);
        border-radius: 5px;
        box-shadow: 0 25px 40px rgba(0, 0, 0, 0.7);
    }
    .list{
        width: 300px;
        font: 580 23px '';
        margin:0px auto; 
        line-height:60px;
    }
</style>