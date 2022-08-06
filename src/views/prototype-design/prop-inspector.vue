<script>
import PropCheckInput from "@/views/prototype-design/prop-check-input"
import PropGridInput from "@/views/prototype-design/prop-grid-input"
import PropNumberInput from "@/views/prototype-design/prop-number-input"
import PropRadioInput from "@/views/prototype-design/prop-radio-input"

const PropInputImpl = {
  grid: PropGridInput,
  radio: PropRadioInput,
  number: PropNumberInput,
  checkbox: PropCheckInput,
}

export default {
  name: "prop-inspector",
  props: ['controlled'],
  emits: ['propChange'],
  components: {
    PropCheckInput, PropGridInput, PropNumberInput, PropRadioInput
  },
  data() {
    return {
      // 所有可能的可编辑值
      inputs: [
        { type: 'number', name: 'X坐标', keyName: 'x' },
        { type: 'number', name: 'Y坐标', keyName: 'y' },
        { type: 'number', name: '宽度' , keyName: 'width'},
        { type: 'number', name: '高度' , keyName: 'height'},
        { type: 'number', name: '最低宽度', keyName: 'minWidth' },
        { type: 'number', name: '最低高度', keyName: 'minHeight' },
        { type: 'grid', name: '网格化', keyName: 'grid' },
        {
          type: 'radio',
          name: '可移动方向',
          keyName: 'axis',
          options: [{ label: 'y', value: 'y' }, { label: 'x', value: 'x' }, { label: 'xy', value: 'xy' }],
        },
        { type: 'checkbox', name: '等比例缩放', keyName: 'acceptRatio' },
        { type: 'checkbox', name: '可拖拽', keyName: 'draggable'},
        { type: 'checkbox', name: '可改变大小', keyName: 'resizable' },
      ],
      extraInputs: [{ type: 'text', name: 'value' }, { type: 'text', name: 'label' }]
    }
  },
  methods: {
    customChange(e, item) {
      console.log("Received custom event from child component. " + e)
      this.$emit('propChange', {
        ...item,
        value: e
      })
    },
    extraChange(e, item) {
      this.$emit('propChange', {
        ...item,
        value: e.target.value,
        checked: e.target.checked,
        extra: true,
      })
    },
  },
  render(){
    return (
        <div class="ds-inspector">
          <div>通用属性</div>
          {this.inputs.map((item) => {
            let DyInput = PropInputImpl[item.type]
            return(
                <div class="input-item" key={item.keyName}>
                  <label class="input-label">{item.name}</label>
                  <DyInput
                    options={item.options}
                    value={this.controlled[item.keyName]}
                    onPropInput={(e) => this.customChange(e, item)}
                    />
                </div>
            )
          })}

          <div>附加属性</div>
          {this.controlled &&
          this.controlled.extra &&
          this.extraInputs
              .filter((item) => item.name in this.controlled.extra)
              .map((item) => {
                return (
                    <div class="input-item" key={item.name}>
                      <label class="input-label">{item.name}</label>
                      <input
                          onInput={(e) => this.extraChange(e, item)}
                          class="input-value"
                          type={item.type}
                          checked={this.controlled.extra[item.name]}
                          value={this.controlled.extra[item.name]}
                      />
                    </div>
                )
              })}
        </div>
    )
  }
}
</script>

<style lang="less">
.ds-inspector {

  height: 75vh;
  border-left: 1px solid #ececec;
  padding: 15px;
  overflow-y: scroll;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.50);
  box-shadow: 3px 3px 10px #bebebe;
  margin: 20px 20px 10px 10px;

  .input-item {
    margin-bottom: 12px;
    display: flex;
  }
  .input-label {
    display: inline-block;
    width: 100px;

    color: #555;
  }
  .input-value:not([type='checkbox']) {
    height: 24px;
    padding: 0;
    border-radius: 0;
    border: 1px solid #d3d3d3;
    padding-left: 10px;
    flex: 1;
    width: 0;
  }
}
</style>

