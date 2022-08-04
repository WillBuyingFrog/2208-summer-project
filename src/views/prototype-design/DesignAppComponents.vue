<template>
  <div class="ds-components">
    <div
        v-for="(item, index) in elements"
        @dragstart="(e) => {this.handleDrag(e, item)}"
        draggable="true"
        :key="index"
        class="components-item"
    >
      <span>{{item.name}}</span>
    </div>
  </div>
</template>


<script>

import Logo from '@/assets/logo.png'

export default {
  name: "DesignAppComponents",
  data(){
    return {
      // 未来可以单独写一个加载components的功能
      elements: [
        {
          type: 'label',
          value: '一段文本',
          name: 'Label',
          width: 150,
          height: 30,
        },
        {
          type: 'input',
          value: '输入',
          inputType: 'input',
          name: 'Input',
          width: 150,
          height: 30,
        },
        {
          type: 'select',
          options: [],
          name: 'Select',
          width: 150,
          height: 30,
        },
        {
          type: 'img',
          name: 'Image',
          url: Logo,
          width: 100,
          height: 100,
        },
        {
          type: 'input',
          inputType: 'checkbox',
          name: 'Checkbox',
          label: '多选',
          width: 100,
          height: 30,
        },
        {
          type: 'input',
          inputType: 'radio',
          name: 'Radio',
          label: '单选',
          width: 100,
          height: 30,
        },
        {
          type: 'input',
          inputType: 'button',
          name: 'Button',
          value: 'Button',
          width: 100,
          height: 30,
        },
        {
          type: 'input',
          inputType: 'date',
          name: 'Date',
          value: '2021-10-10',
          width: 100,
          height: 30,
        },
        {
          type: 'container',
          name: 'Container',
          width: 200,
          height: 200,
          children: [],
        },
      ]
    }
  },
  methods: {
    handleDrag(e, item) {
      e.dataTransfer.dropEffect = 'copy'
      // 这一项之后将会在drop事件中传给PluginDrop
      e.dataTransfer.setData('text/component', JSON.stringify(item))
    },
  }
}
</script>

<style>
.ds-components {
  width: 178px;
  position: relative;
  overflow-y: scroll;
  margin: 20px 10px 10px 10px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.50);
  box-shadow: 3px 3px 10px #bebebe;
}
.components-icon {
  width: 35px;
  height: 35px;
  margin-bottom: 6px;
}
.components-item {
  height: 30px;
  width: 100%;
  font-weight: 300;
  margin: 10px 0 10px 0;
}
.components-item :hover {
  color: #999999;
}
</style>
