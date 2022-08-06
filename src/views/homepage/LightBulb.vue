<template>
  <div id="light-bulb" class="{this.on?off:on}" @click="turn()">
    <span class="bulb off"></span>
    <span class="bulb on"></span>
  </div>
</template>

<script>
export default {
  name: "LightBulb",
  data (){
    return {
      on: false,
    };
  },
  methods: {
    turn () {
      this.on = !this.on;
    }
  }
}
</script>

<style scoped>
body {
  background: #46484b;
}

#light-bulb {
  position: relative;
  width: 150px;
  height: 150px;
  margin: 0 auto;
  transition: opacity 0.5s;
}
#light-bulb .bulb {
  position: absolute;
  display: inline-block;
  width: 100%;
  height: 100%;
  background-image: url(https://lh4.googleusercontent.com/-katLGTSCm2Q/UJC0_N7XCrI/AAAAAAAABq0/6GxNfNW-Ra4/s300/lightbulb.png);
}
#light-bulb .bulb.off {
  background-position-x: -150px;
}
#light-bulb .bulb.on {
  background-position-x: 0;
}
#light-bulb.off .bulb.on {
  opacity: 0;
}
#light-bulb.off .bulb.off {
  opacity: 1;
}
#light-bulb.on .bulb.on {
  opacity: 1;
}
#light-bulb.on .bulb.off {
  opacity: 0;
}
</style>