<template>
  <div class="ds-components">
    <span>基础组件</span>
    <div
        v-for="(item, index) in elements"
        @dragstart="(e) => {this.handleDrag(e, item)}"
        draggable="true"
        :key="index"
        class="components-item"
    >
      <span>{{item.displayName}}</span>
    </div>
    <el-divider />
    <div
        v-for="(item, index) in styledElements"
        @dragstart="(e) => {this.handleDrag(e, item)}"
        draggable="true"
        :key="index"
        class="components-item"
    >
      <span>{{item.displayName}}</span>
    </div>
    <el-divider />
    <div
        v-for="(item, index) in purePicture"
        @dragstart="(e) => {this.handleDrag(e, item)}"
        draggable="true"
        :key="index"
        class="components-item"
    >
      <span>{{item.displayName}}</span>
    </div>
  </div>
</template>


<script>
import Logo from '@/assets/images/logo.png'

// 328 252
import Pic1 from '@/assets/template_school/tip.png'

import iPhone from '@/assets/template_school/iPhone.png'

export default {
  name: "DesignAppComponents",
  data(){
    return {
      purePicture: [
        {
          type: 'img',
          displayName: '墨书Logo',
          name: 'Image',
          url: Logo,
          width: 100,
          height: 100,
        },
        {
          type: 'Avatar',
          displayName: '用户头像',
          name: 'Avatar1',
          width: 100,
          height: 100,
        },
        {
          type: 'img',
          displayName: '手机外壳',
          name: 'Image2',
          url: iPhone,
          width: 300,
          height: 605,
        },
      ],
      styledElements: [

        {
          type: 'BouncyButton',
          displayName: '仿FontAwesome按钮',
          name: 'Button1',
          value: '测试文字',
          width: 100,
          height: 30,
        },
        {
          type: 'El_Menu',
          displayName: '侧边栏',
          name: 'Menu1',
          menuSectionOne: 'No.1', menuSectionTwo: 'No.2', menuSectionThree: 'No.3', menuSectionFour: 'No.4',
          width: 100,
          height: 300,
        },
        {
          type: 'Card',
          displayName: '圆角卡片(3:3)',
          name: 'Shape1',
          cardInfo: '这里是卡片占位说明',
          width: 300,
          height: 300,
        },
        {
          type: 'RoundTransparent',
          displayName: '圆角无背景(4:3)',
          name: 'Shape1',
          cardInfo: '这里是占位说明',
          width: 400,
          height: 300,
        },
        {
          type: 'RoundTransparent',
          displayName: '圆角无背景(6:3)',
          name: 'Shape2',
          cardInfo: '这里是占位说明',
          width: 600,
          height: 300,
        },
        {
          type: 'SearchBar',
          displayName: '搜索栏',
          name: 'Shape3',
          searchPrompt: 'Type to explore academic world...',
          width: 600,
          height: 80,
        },
        {
          type: 'PictureCard',
          displayName: '图片展示栏',
          name: 'Shape3',
          imageInfo: '这里展示轮播图片',
          width: 490,
          height: 330,
          url: Pic1
        },
      ],
      elements: [
        {
          type: 'label',
          displayName: '标签',
          value: '一段文本',
          name: 'Label',
          width: 150,
          height: 30,
        },
        {
          type: 'input',
          displayName: '输入框',
          value: '输入',
          inputType: 'input',
          name: 'Input',
          width: 150,
          height: 30,
        },
        {
          type: 'select',
          displayName: '选择框',
          options: [],
          name: 'Select',
          width: 150,
          height: 30,
        },
        {
          type: 'input',
          displayName: '多选框',
          inputType: 'checkbox',
          name: 'Checkbox',
          label: '提示文字',
          width: 100,
          height: 30,
        },
        {
          type: 'input',
          displayName: '单选框',
          inputType: 'radio',
          name: 'Radio',
          label: '提示文字',
          width: 100,
          height: 30,
        },
        {
          type: 'input',
          displayName: '普通按钮',
          inputType: 'button',
          name: 'Button',
          value: 'Button',
          width: 100,
          height: 30,
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
  cursor: move;
}
.components-item :hover {
  color: #999999;
}
</style>
