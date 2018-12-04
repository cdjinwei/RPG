// this.map = {
//     MoveLeft: {
//         from: ['MoveUp', 'MoveDown', 'MoveRight'],
//         to: 'MoveLeft'
//     }
// }

let StateMachine = function (node, map, init_state) {
   

    this._node = node;
    this._map = map;
    this._cur_state = init_state || 'IdleDown';

    this._node.handleState(`on${this._cur_state}Enter`);

    this.transform = function (actionName) {
        let action = this._map[actionName];
        if(action != null){
            if(action.from.indexOf(this._cur_state) == -1){
                console.warn(`can not transfer from ${this._cur_state} to ${action.to}`);
            }else{
                this._node.handleState(`on${this._cur_state}Leave`);
                this._cur_state = action.to;
                this._node.handleState(`on${this._cur_state}Enter`);
            }
        }else{
            console.warn(`action ${actionName} not exits`);
        }
    }

    this.getStatus = function () {
        return this._cur_state;
    }
}


// export default StateMachine;
export { StateMachine }