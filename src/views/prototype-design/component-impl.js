// 这里写出所有需要的component


const El_Menu = {
    props: {
        params: {

        }
    }
}

const BouncyButton = {
    props: {
        params: {
            default: () => ({

            })
        }
    },
    render(){
        // console.log("Extra params in render function:", this.params)
        return (
            <div draggable="false" className="match-parent">
                <span draggable="false" className="notice-bar"
                      style={{display: this.params.usedBy === '__none__' ? "none" : "block"}}>
                    {this.params.usedBy}
                </span>
            <div draggable="false" class="custom-bouncy-button">{this.params.value}</div>
            </div>
        )
    }
}

const Img = {
    props: {
        params: {
            default: () => ({}),
        },
    },
    render() {
        return(
            <div draggable="false" class="match-parent">
                <span draggable="false" class="notice-bar"
                      style={{display: this.params.usedBy === '__none__' ? "none" : "block"}}>
                    {this.params.usedBy}
                </span>
                <img draggable="false" class="match-parent" src={this.params.url}/>
            </div>


            )

    },
}
const Label = {
    props: {
        params: {
            default: () => ({}),
        },
    },
    render() {
        return (
            <div draggable="false" class="match-parent" style={{zIndex: 99999}}>
                {this.params.value}
            </div>
        )
    },
}


const Input = {
    props: {
        params: {
            default: () => ({
                value: '',
                type: 'input',
            }),
        },
    },
    render() {
        if (['checkbox', 'radio'].includes(this.params.inputType)) {
            return (
                <label class="match-parent input-has-label">
                    <input type={this.params.inputType} value={this.params.value} />
                    {this.params.label}
                </label>
            )
        }
        return <input class="match-parent" type={this.params.inputType} value={this.params.value} />
    },
}

const Select = {
    props: {
        params: {
            default: () => ({
                value: '',
                options: [{ label: 'text', value: 'text' }],
            }),
        },
    },
    render() {
        return (
            <select class="match-parent" value={this.params.url}>
                {this.params.options.map((item) => (
                    <option value={item.value} key={item.value}>
                        {item.label}
                    </option>
                ))}
            </select>
        )
    },
}

const Rect = {
    render() {
        return <div class="match-parent" class="rect" />
    },
}


// 最终export一个"数组"，记录每种元素对应的对象。
// 对象实际上就是一个小型的Vue组件，其中的render()的返回值包含了
// 元素最终渲染到屏幕上的内容。
export default {
    img: Img,
    input: Input,
    select: Select,
    rect: Rect,
    label: Label,
    El_Menu: El_Menu,
    BouncyButton: BouncyButton
}
