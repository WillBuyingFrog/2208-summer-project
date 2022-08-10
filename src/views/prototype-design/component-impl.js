// 这里写出所有需要的component


const El_Menu = {
    props: {
        params: {
            default: () => ({}),
        },
    },
    render(){
        return (
            <div draggable="false" className="match-parent">
                <span draggable="false" className="notice-bar"
                      style={{display: this.params.usedBy === '__none__' ? "none" : "block"}}>
                    {this.params.usedBy}
                </span>
                <div class="el-menu-base">
                    <div class="el-menu-section">
                        <span>
                            <span style={{marginRight: '5px'}}>
                               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    className="bi bi-1-circle" viewBox="0 0 16 16">
  <path
      d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8Zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0ZM9.283 4.002V12H7.971V5.338h-.065L6.072 6.656V5.385l1.899-1.383h1.312Z"/>
</svg>
                            </span>
                            {this.params.menuSectionOne}
                        </span>
                    </div>
                    <div class="el-menu-section">
                        <span>
                            <span style={{marginRight: '5px'}}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     className="bi bi-2-circle" viewBox="0 0 16 16">
  <path
      d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8Zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0ZM6.646 6.24v.07H5.375v-.064c0-1.213.879-2.402 2.637-2.402 1.582 0 2.613.949 2.613 2.215 0 1.002-.6 1.667-1.287 2.43l-.096.107-1.974 2.22v.077h3.498V12H5.422v-.832l2.97-3.293c.434-.475.903-1.008.903-1.705 0-.744-.557-1.236-1.313-1.236-.843 0-1.336.615-1.336 1.306Z"/>
</svg>
                            </span>
                            {this.params.menuSectionTwo}
                        </span>
                    </div>
                    <div class="el-menu-section">
                        <span>
                            <span style={{marginRight: '5px'}}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     className="bi bi-3-circle" viewBox="0 0 16 16">
  <path
      d="M7.918 8.414h-.879V7.342h.838c.78 0 1.348-.522 1.342-1.237 0-.709-.563-1.195-1.348-1.195-.79 0-1.312.498-1.348 1.055H5.275c.036-1.137.95-2.115 2.625-2.121 1.594-.012 2.608.885 2.637 2.062.023 1.137-.885 1.776-1.482 1.875v.07c.703.07 1.71.64 1.734 1.917.024 1.459-1.277 2.396-2.93 2.396-1.705 0-2.707-.967-2.754-2.144H6.33c.059.597.68 1.06 1.541 1.066.973.006 1.6-.563 1.588-1.354-.006-.779-.621-1.318-1.541-1.318Z"/>
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0ZM1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8Z"/>
</svg>
                            </span>
                            {this.params.menuSectionThree}
                        </span>
                    </div>
                    <div class="el-menu-section">
                        <span>
                            <span style={{marginRight: '5px'}}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     className="bi bi-4-circle" viewBox="0 0 16 16">
  <path
      d="M7.519 5.057c.22-.352.439-.703.657-1.055h1.933v5.332h1.008v1.107H10.11V12H8.85v-1.559H4.978V9.322c.77-1.427 1.656-2.847 2.542-4.265ZM6.225 9.281v.053H8.85V5.063h-.065c-.867 1.33-1.787 2.806-2.56 4.218Z"/>
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0ZM1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8Z"/>
</svg>
                            </span>
                            {this.params.menuSectionFour}
                        </span>
                    </div>
                </div>

            </div>
        )
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

const Card = {
    props: {
        params: {
            default: () => ({}),
        },
    },
    render(){
        return (
            <div class="round-card">
                <span draggable="false" className="notice-bar"
                      style={{display: this.params.usedBy === '__none__' ? "none" : "block"}}>
                    {this.params.usedBy}
                </span>
                <div class="round-card-inner">
                    <span>
                        {this.params.cardInfo}
                    </span>
                </div>
            </div>
        )
    }
}

const RoundTransparent = {
    props: {
        params: {
            default: () => ({}),
        },
    },
    render(){
        return (
            <div class="round-transparent">
                <span draggable="false" className="notice-bar"
                      style={{display: this.params.usedBy === '__none__' ? "none" : "block"}}>
                    {this.params.usedBy}
                </span>
                <div class="round-card-inner">
                    <span>
                        {this.params.cardInfo}
                    </span>
                </div>
            </div>
        )
    }
}

const PictureCard = {
    props: {
        params: {
            default: () => ({}),
        },
    },
    render(){
        return (
            <div class="round-transparent">
                <span draggable="false" className="notice-bar"
                      style={{display: this.params.usedBy === '__none__' ? "none" : "block"}}>
                    {this.params.usedBy}
                </span>
                <div class="match-parent">
                    <img draggable="false" src={this.params.url}/>
                    <p>
                        {this.params.imageInfo}
                    </p>
                </div>
            </div>
        )
    }
}

const SearchBar = {
    props: {
        params: {
            default: () => ({}),
        },
    },
    render(){
        return (
            <div class="search-bar">
                <span draggable="false" className="notice-bar"
                      style={{display: this.params.usedBy === '__none__' ? "none" : "block"}}>
                    {this.params.usedBy}
                </span>
                <div class="search-bar-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor"
                         viewBox="0 0 16 16">
                        <path fill-rule="evenodd"
                              d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.854 5.146a.5.5 0 1 0-.708.708L9.243 9.95H6.475a.5.5 0 1 0 0 1h3.975a.5.5 0 0 0 .5-.5V6.475a.5.5 0 1 0-1 0v2.768L5.854 5.146z"/>
                    </svg>
                    <span style={{fontSize: '20px', marginLeft: '10px'}}>
                        {this.params.searchPrompt}
                    </span>
                </div>
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

const Avatar = {
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
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor"
                     viewBox="0 0 16 16">
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                    <path fillRule="evenodd"
                          d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                </svg>
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
    BouncyButton: BouncyButton,
    Card: Card,
    RoundTransparent: RoundTransparent,
    SearchBar: SearchBar,
    PictureCard: PictureCard,
    Avatar: Avatar
}
