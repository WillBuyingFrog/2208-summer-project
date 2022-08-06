<template>
  <div class="bg">
    <div class="a">
      <span style="--i:1">墨 </span>
      <span style="--i:2">书</span>
    </div>
    <div class="b">
      <span style="--i:3">M </span>
      <span style="--i:4">O </span>
      <span style="--i:5">S </span>
      <span style="--i:6">H </span>
      <span style="--i:7">U</span>
    </div>
    <div class="c">
      <span style="--i:3">点</span>
      <span style="--i:4">亮</span>
      <span style="--i:5">你</span>
      <span style="--i:6">的</span>
      <span style="--i:7">每</span>
      <span style="--i:8">一</span>
      <span style="--i:9">个</span>
      <span style="--i:10">创</span>
      <span style="--i:11">意</span>
    </div>
  </div>
</template>
  <script>
export default {
  name: "LightComponent",

};

</script>

<style scoped>
.bg{
  background-color: #0093E9;
  background-image: linear-gradient(160deg, #0093E9 0%, #80D0C7 100%);
  display: flex;
  justify-content: center;
  background-size: 100% auto;
  background-repeat: repeat-y;
  min-height: 800px;
  overflow: auto;
  width: 100%;
  height: 100%;
}
.a{
  position: absolute;
  top: 100px;
  font: bold 150px '';
  color: #333;
  cursor: pointer;
}
.a span{
  transition: .5s;
  transition-delay: calc(var(--i)*.1s);
}
.a:hover span{
  color: #fff;
  text-shadow: 0 0 10px #fff,
  0 0 20px #fff,
  0 0 30px #fff,
  0 0 50px #fff,
  0 0 80px #fff;
}

.b{
  position: absolute;
  top: 270px;
  font: 100 80px '';
  color: #333;
  cursor: pointer;
}
.b span{
  transition: .5s;
  transition-delay: calc(var(--i)*.1s);
}
.b:hover span{
  color: #fff;
  text-shadow: 0 0 10px #fff,
  0 0 20px #fff,
  0 0 30px #fff,
  0 0 50px #fff,
  0 0 80px #fff;
}

.c{
  position: absolute;
  top: 550px;
  font: 100 50px '';
  color: #333;
  cursor: pointer;
}
.c span{
  transition: .5s;
  transition-delay: calc(var(--i)*.1s);
}
.c:hover span{
  color: #fff;
  text-shadow: 0 0 10px #fff,
  0 0 20px #fff,
  0 0 30px #fff,
  0 0 50px #fff,
  0 0 80px #fff;
}
</style>