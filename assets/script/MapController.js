// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        MainCamera: cc.Node,
        template: cc.Node,
        pannel_bottom: cc.Node,
        pannel_side: cc.Node,
        role_prefab: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.registerEvent();
        this._tiledMap = this.node.getComponent(cc.TiledMap);
        this._map_floor = this._tiledMap.getLayer('floor');
        this._cur_action_role;
        this._action_area_nodes = [];
        this._all_role = [];
        this.initView();
    },

    initView(){
        this.hideActionPannel();


        this.addRole(new cc.Vec2(2,2),{});
    },

    onDestroy() {
        this.unregisterEvent();
    },

    registerEvent() {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoved, this);
        this.node.on(cc.Node.EventType)
        this._handler = this.handleEvent.bind(this);
        event_mgr.register_event(this._handler);
    },

    unregisterEvent() {
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoved, this);
        event_mgr.unregister_event(this._handler);
    },

    handleEvent(ev) {
        switch (ev.event_type) {
            case EVENT_CODE.EVENT_FOCUS_ROLE:
                this._cur_action_role = ev.role;
                this.showActionPannel();
                this.focusOnPos(this._cur_action_role.node.position);
                break;

            default:
                break;
        }
    },

    onTouchMoved(event) {
        console.log(event.getDelta());
        this.MainCamera.position = this.MainCamera.position.subSelf(event.getDelta().div(2));
    },

    showActionPannel(){
        this.pannel_bottom.runAction(cc.moveBy(0.3, new cc.Vec2(0, this.pannel_bottom.height)));
        this.pannel_side.runAction(cc.moveBy(0.3, new cc.Vec2(-this.pannel_side.width, 0)));
    },

    hideActionPannel(){
        this.pannel_bottom.runAction(cc.moveBy(0.3, new cc.Vec2(0, -this.pannel_bottom.height)));
        this.pannel_side.runAction(cc.moveBy(0.3, new cc.Vec2(this.pannel_side.width, 0)));
    },

    focusOnPos(tilePos){
        // let pixPos = this.getPixPos(tilePos);
        // this.MainCamera.position = pixPos;
        this.MainCamera.position = tilePos;
    },

    addRole(pos, role){
        let pixelPos = this.getPixPos(pos);
        let new_role = cc.instantiate(this.role_prefab);
        //initial role
        new_role.parent = this.node;
        this._all_role.push(new_role);

        new_role.position = pixelPos;
    },

    getTilePos(posInPixel) {
        var mapSize = this.node.getContentSize();
        var tileSize = this._tiledMap.getTileSize();
        var x = Math.floor(posInPixel.x / tileSize.width);
        var y = Math.floor((mapSize.height - (posInPixel.y + 1)) / tileSize.height);

        return cc.v2(x, y);
    },

    getPixPos(posInTile) {
        // let mapSize = this.node.getContentSize();
        // let tileSize = this._tiledMap.getTileSize();

        // let x = (posInTile.x + 0.5) * tileSize.width;
        // let y = mapSize.height - ((posInTile.y + 1) * tileSize.height);
        let posInPixel = this._map_floor.getPositionAt(posInTile);
        posInPixel.x -= this.node.width / 2 - this._tiledMap.getTileSize().width / 2;
        posInPixel.y -= this.node.height / 2;
        return posInPixel;
    },

    cleanActionArea(){
        for(let i = 0; i < this._action_area_nodes.length; i++){
            let node = this._action_area_nodes[i];
            node.destroy();
        }
        this._action_area_nodes = [];
    },

    createActionArea(startPos) {
        if(this._action_area_nodes.length > 0) return;
        //以startPos为中心,创建玩家可以移动的区域
        let max_dis = 2;
        for (let x = startPos.x - max_dis; x <= startPos.x + max_dis; x++) {
            for (let y = startPos.y - max_dis; y <= startPos.y + max_dis; y++) {
                if(x < 0 || x > 9 || y < 0 || y > 9) continue;
                if (this.getVectorValue(startPos, cc.v2(x, y)) <= max_dis * max_dis) {
                    let node = cc.instantiate(this.template);
                    this._action_area_nodes.push(node);
                    node.position = this.getPixPos(cc.v2(x, y));
                    node.parent = this.node;
                    node.on(cc.Node.EventType.TOUCH_END, () => {
                        let pos = new cc.Vec2(x, y);
                        this.tryMoveRole(pos);
                    });
                }
            }
        }
    },

    tryMoveRole(pos) {
        if(this._cur_action_role != undefined){
            this.movePlayer(this._cur_action_role, pos);
        }else{
            console.log('action role not exist');
        }
    },

    movePlayer(role, disPos){
        this.cleanActionArea();
        let path = [];
        let curPos = this.getTilePos(role.position);
        while (!curPos.equals(disPos)){
            if(curPos.x > disPos.x){
                curPos.x--;
                path.push({
                    type: 'move',
                    status: 'MoveLeft',
                    finish_status: 'IdleLeft',
                    cord: new cc.Vec2(-1, 0)
                });
            }else if(curPos.x < disPos.x){
                curPos.x++;
                path.push({
                    type: 'move',
                    status: 'MoveRight',
                    finish_status: 'IdleRight',
                    cord: new cc.Vec2(1, 0)
                });
            }else if(curPos.y > disPos.y){
                curPos.y--;
                path.push({
                    type: 'move',
                    status: 'MoveUp',
                    finish_status: 'IdleUp',
                    cord: new cc.Vec2(0, 1)
                });
            }else if(curPos.y < disPos.y){
                curPos.y++;
                path.push({
                    type: 'move',
                    status: 'MoveDown',
                    finish_status: 'IdleDown',
                    cord: new cc.Vec2(0, -1)
                });
            }
        }
        role.getComponent('RoleController').addCmd(path);
    },

    getVectorValue(v1, v2){
        let x = v1.x - v2.x;
        let y = v1.y - v2.y;
        return Math.pow(x, 2) + Math.pow(y, 2);
    },
    // update (dt) {},
});