<template>
  <div class="ds-app">
    <DesignAppHeader />

    <DesignAppFooter />
  </div>
</template>

<script>
import DesignAppFooter from "@/views/prototype-design/DesignAppFooter";
import DesignAppHeader from "@/views/prototype-design/DesignAppHeader";


export default {
  name: "DesignApp",
  components:{
    DesignAppHeader,
    DesignAppFooter
  }
}
</script>

<style scoped>
.ds-app{
  color: black;
}
</style>
