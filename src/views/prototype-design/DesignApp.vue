<template>
  <div class="ds-app">
    <DesignAppHeader />
    <el-row :gutter="20">
      <el-col :span="4">
        <DesignAppComponents />
      </el-col>
      <el-col :span="16">

      </el-col>
      <el-col :span="4">

      </el-col>
    </el-row>

    <DesignAppFooter />
  </div>
</template>

<script>
import DesignAppFooter from "@/views/prototype-design/DesignAppFooter";
import DesignAppHeader from "@/views/prototype-design/DesignAppHeader";
import DesignAppComponents from "@/views/prototype-design/DesignAppComponents";

import eventBus from "@/views/prototype-design/utils/eventBus"

export default {
  name: "DesignApp",
  components:{
    DesignAppHeader, DesignAppFooter, DesignAppComponents
  },
  methods: {

  },
  created() {
    eventBus.$on()
  }
}
</script>

<style scoped>
.ds-app{
  color: black;
}
</style>
