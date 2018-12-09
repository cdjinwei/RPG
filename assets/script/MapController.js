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
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.registerEvent();
        let layers = this.node.getComponent(cc.TiledMap).getLayers();
        let tile = layers[0].getTileSet();
        console.log(layers);
        console.log(tile);
    },

    onDestroy(){
        this.unregisterEvent();
    },

    registerEvent(){
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoved, this);
    },

    unregisterEvent(){
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoved, this);
    },

    onTouchMoved(event){
        console.log(event.getDelta());
        this.MainCamera.position = this.MainCamera.position.subSelf(event.getDelta());
    },
    // update (dt) {},
});
