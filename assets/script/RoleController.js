// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
import {
    StateMachine
} from './state_machine';

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.registerEvent();
        this.animation = this.node.getComponent(cc.Animation);
        let map = {
            MoveLeft: {
                from: ['MoveUp', 'MoveDown', 'MoveRight', 'IdleLeft', 'IdleRight', 'IdleUp', 'IdleDown'],
                to: 'MoveLeft'
            },
            MoveRight: {
                from: ['MoveUp', 'MoveDown', 'MoveLeft', 'IdleLeft', 'IdleRight', 'IdleUp', 'IdleDown'],
                to: 'MoveRight'
            },
            MoveUp: {
                from: ['MoveLeft', 'MoveDown', 'MoveRight', 'IdleLeft', 'IdleRight', 'IdleUp', 'IdleDown'],
                to: 'MoveUp'
            },
            MoveDown: {
                from: ['MoveUp', 'MoveLeft', 'MoveRight', 'IdleLeft', 'IdleRight', 'IdleUp', 'IdleDown'],
                to: 'MoveDown'
            },
            IdleLeft: {
                from: ['MoveUp', 'MoveDown', 'MoveRight', "MoveLeft"],
                to: 'IdleLeft'
            },
            IdleRight: {
                from: ['MoveUp', 'MoveDown', 'MoveRight', "MoveLeft"],
                to: 'IdleRight'
            },
            IdleUp: {
                from: ['MoveUp', 'MoveDown', 'MoveRight', "MoveLeft"],
                to: 'IdleUp'
            },
            IdleDown: {
                from: ['MoveUp', 'MoveDown', 'MoveRight', "MoveLeft"],
                to: 'IdleDown'
            }
        }
        this.state_machine = new StateMachine(this, map, 'IdleDown');

        this.cmd_list = [{
                type: 'move',
                status: 'MoveUp',
                finish_status: 'IdleUp',
                cord: cc.v2(0, 1),
            },
            {
                type: 'move',
                status: 'MoveUp',
                finish_status: 'IdleUp',
                cord: cc.v2(0, 1),
            },
            {
                type: 'move',
                status: 'MoveUp',
                finish_status: 'IdleUp',
                cord: cc.v2(0, 1),
            },
            {
                type: 'move',
                status: 'MoveRight',
                finish_status: 'IdleRight',
                cord: cc.v2(1, 0),
            },
            {
                type: 'move',
                status: 'MoveRight',
                finish_status: 'IdleRight',
                cord: cc.v2(1, 0),
            },
            {
                type: 'move',
                status: 'MoveDown',
                finish_status: 'IdleDown',
                cord: cc.v2(0, -1),
            },
            {
                type: 'move',
                status: 'MoveDown',
                finish_status: 'IdleDown',
                cord: cc.v2(0, -1),
            },
            {
                type: 'move',
                status: 'MoveDown',
                finish_status: 'IdleDown',
                cord: cc.v2(0, -1),
            },
        ];
        // this.executeCmds(cmd_list);
    },

    onDestroy() {
        this.unregisterEvent();
    },

    registerEvent() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    unregisterEvent() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    executeCmds() {
        if (this.cmd_list.length > 0) {
            if (this.state_machine.getStatus().indexOf('Idle') != -1) {
                //去处数组的第一个命令
                let step = 30; //每次移动100像素
                let duration = 0.5; //每次移动耗时0.5s
                let cmd = this.cmd_list.shift();
                switch (cmd.type) {
                    case 'move':
                        this.state_machine.transform(cmd.status);
                        let action = cc.sequence(
                            cc.moveBy(duration, cc.v2(cmd.cord.x * step, cmd.cord.y * step)),
                            cc.callFunc(() => {
                                this.state_machine.transform(cmd.finish_status);
                            })
                        );
                        this.node.runAction(action);
                        break;

                    default:
                        break;
                }
            }
        }
    },

    onKeyDown(ev) {
        switch (ev.keyCode) {
            case cc.macro.KEY.w:
                //move up
                this.state_machine.transform('MoveUp');
                break;
            case cc.macro.KEY.a:
                //move left
                this.state_machine.transform('MoveLeft');
                break;
            case cc.macro.KEY.s:
                //move down
                this.state_machine.transform('MoveDown');
                break;
            case cc.macro.KEY.d:
                //move right
                this.state_machine.transform('MoveRight');
                break;
            default:
                break;
        }
    },

    onKeyUp(ev) {
        switch (ev.keyCode) {
            case cc.macro.KEY.w:
                //enter idle up
                this.state_machine.transform('IdleUp');
                break;
            case cc.macro.KEY.a:
                //enter idle left
                this.state_machine.transform('IdleLeft');
                break;
            case cc.macro.KEY.s:
                //enter idle down
                this.state_machine.transform('IdleDown');
                break;
            case cc.macro.KEY.d:
                //enter idle right
                this.state_machine.transform('IdleRight');
                break;
            default:
                break;
        }
    },

    handleState(state) {
        switch (state) {
            case 'onMoveUpEnter':
                this.animation.play('role_1_move_up');
                console.log('player onMoveUpEnter');
                break;
            case 'onMoveDownEnter':
                this.animation.play('role_1_move_down');
                console.log('player onMoveDownEnter');
                break;
            case 'onMoveLeftEnter':
                this.animation.play('role_1_move_hor');
                console.log('player onMoveLeftEnter');
                break;
            case 'onMoveRightEnter':
                this.animation.play('role_1_move_hor');
                console.log('player onMoveRightEnter');
                break;
            case 'onMoveUpLeave':
                this.animation.stop();
                console.log('player onMoveUpLeave');
                break;
            case 'onMoveDownLeave':
                this.animation.stop();
                console.log('player onMoveDownLeave');
                break;
            case 'onMoveLeftLeave':
                this.animation.stop();
                console.log('player onMoveLeftLeave');
                break;
            case 'onMoveRightLeave':
                this.animation.stop();
                console.log('player onMoveRightLeave');
                break;
            case 'onIdleRightLeave':
                this.animation.stop();
                console.log('player onIdleRightLeave');
                break;
            case 'onIdleLeftLeave':
                this.animation.stop();
                console.log('player onIdleLeftLeave');
                break;
            case 'onIdleUpLeave':
                this.animation.stop();
                console.log('player onIdleUpLeave');
                break;
            case 'onIdleDownLeave':
                this.animation.stop();
                console.log('player onIdleDownLeave');
                break;
            case 'onIdleRightEnter':
                // this.animation.play('role_1_move_hor');
                this.animation.stop();
                console.log('player onIdleRightEnter');
                break;
            case 'onIdleLeftEnter':
                // this.animation.play('role_1_move_hor');
                this.animation.stop();
                console.log('player onIdleLeftEnter');
                break;
            case 'onIdleUpEnter':
                // this.animation.play('role_1_move_up');
                this.animation.stop();
                console.log('player onIdleUpEnter');
                break;
            case 'onIdleDownEnter':
                // this.animation.play('role_1_move_down');
                this.animation.stop();
                console.log('player onIdleDownEnter');
                break;
            default:
                break;
        }
    },
    update(dt) {
        this.executeCmds();
    },
});


//js 数组的几个方法
//push 添加一个元素到数组尾部
//pop 从数组中移除队尾的元素并返回
//shift 把数组中的第一个元素移除并返回
//unshift 添加一个元素到数组头部