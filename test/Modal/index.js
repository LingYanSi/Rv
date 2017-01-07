let {Component} = window.Rv

import './index.scss'

// 如何使用命令式方式打开一个Modal组件呢？
// 如何把子组件传递进来？
export default class Modal extends Component {
    template =  `
        <div style={warpStyle} class="modal-warp">
            <div v-if={type} class="cancel" style={modalStyle} complete-style={modalStyleComplete} onClick={layerClose && close}></div>
            <div v-if={type} style={contentStyle} complete-style={contentStyleComplete}>
                <div v-if={type == "alert"}>
                    <p>{msg}</p>
                    <div class="bottom">
                        <button onClick={close}>确认</button>
                        <button onClick={close} class="cancel">取消</button>
                    </div>
                </div>
                <div v-if={type == "tips"}>
                    <p>{msg}</p>
                </div>
                <div v-if={type == "confirm"}>
                    <p>{msg}</p>
                    <div class="bottom">
                        <button onClick={close}>确认</button>
                    </div>
                </div>
                <div v-if={type == "body"}>
                    <Body {...bodyData}></Body>
                </div>
            </div>
        </div>
    `
    data = {
        warpStyle: {
            display: 'none'
        },
        modalStyle: {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0)',
            transition: 'all .4s',
        },
        modalStyleComplete: `background: rgba(0, 0, 0, .6)`,
        contentStyle: `width: 200px;
            position: absolute; top: 50%; left: 50%;
            background: #fff;
            transition: all .4s;
            transform: translate3d(-50%, -50%, 0) scale3d(.5, .5, 1);`,
        contentStyleComplete: `transform: translate3d(-50%, -50%, 0) scale3d(1, 1, 1);`,
        type: 'alert',
        msg: '',
        layerClose: true,
        bodyData: {}
    }
    components = {Body: null}
    static open = (type, msg, options = {})=>{
        let self = Modal.self
        let {layerClose = true, submit, cancel, Body, props} = options
        self.show()

        self.type = type
        self.options = options
        self.layerClose = layerClose

        if (type == 'body') {
            self.components.Body = Body
            self.bodyData = props
        } else {
            self.msg = msg

            if (type == 'tips') {
                setTimeout(()=>{
                    self.type = ''
                }, 2000)
            }
        }
    }
    static close = ()=>{
        Modal.self.close()
    }
    method = {
        show(){
            this.warpStyle.display = 'block'
        },
        close(event){
            let yes = event ? !event.target.classList.contains('cancel') : false
            this.warpStyle.display = 'none'
            if (this.options) {
                let {submit, cancel} = this.options
                yes ? (submit && submit()) : (cancel && cancel())
                this.options = null
            }
        }
    }
    componentDidMount(){
        Modal.self = this
    }
}


window.Modal = Modal
