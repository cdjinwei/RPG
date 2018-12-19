window.EVENT_CODE = {
    EVENT_FOCUS_ROLE: 1000,
    EVENT_SEL_MOVE_DIST: 1001,
    EVENT_MOVE_DIST: 1002,
    EVENT_SEL_ATK_TARGET: 1003,
}

window.MyCustomEvent = {
    FocusRoleEvent: function (role) {
        this.event_type = EVENT_CODE.EVENT_FOCUS_ROLE;
        this.role = role;
    },
    ShowMoveArea: function () {
        this.event_type = EVENT_CODE.EVENT_SEL_MOVE_DIST;
    },
    ShowAtkArea: function () {
        this.event_type = EVENT_CODE.EVENT_SEL_ATK_TARGET;
    }
}