let {Component} = window.Rv

export default class Nine extends Component {
    template = `
        <div v-for={x in list}>
            <div>{x}</div>
        </div>
    `
    data = {
        list: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    }
}
