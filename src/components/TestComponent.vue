<template>
  <el-space direction="vertical">
    <span>
      这是第一个测试组件。
    </span>
    <el-button type="primary" plain>
      测试按钮1
    </el-button>
  </el-space>
          
    <div class="card">
        <div class="card-face card-front">正面</div>
        <div class="card-face card-back">反面</div>
    </div>
    <div class="courseLogo">
    <div class="courseBefore" style="background-image: url(img/bks.png);"></div>
    <div class="courseAfter">测试文字，测试文字，测试文字，测试文字，测试文字，测试文字</div>
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
.courseLogo{
    width: 120px;
    height: 132px;

    float: left;
    margin-top: 1px;
    position: relative;
    box-sizing: border-box;
    perspective: 800px;
}

.courseBefore{
    width: 100%;
    height: 100%;
    position: absolute;
    top:0;
    left: 0;
    background-repeat: no-repeat;
    background-position: center center;
    backface-visibility: hidden;
    transition: 1s;
    background-color: pink;

}
.courseAfter{
    width: 100%;
    height: 100%;
    position: absolute;
    top:0;
    left: 0;
    color: #fff;
    background-color: dodgerblue;
    text-indent: 2em;
    transform: rotateY(-180deg);
    backface-visibility: hidden;
    transition: 1s;

}
 .courseLogo:hover .courseBefore{
    transform: rotateY(180deg);
}
.courseLogo:hover .courseAfter{
    transform: rotateY(0deg);
}
.card{
            width: 200px;
            height: 200px;
            position: relative;
            margin: auto;
            transition: transform 3s;   
            transform-style: preserve-3d;
            perspective: 800px        
        }
        .card-face{
            width: 100%;
            height: 100%;
            position: absolute;
        }
        .card-front{
            background: orange;
        }
        .card-back {
            background: palegreen;
            transform: rotateY(180deg);
            backface-visibility: hidden;
        }
        .card:hover .card-front{
            transform: rotateY(180deg);
        }
        .card:hover .card-back{
            transform: rotateY(0deg);
        }

</style>