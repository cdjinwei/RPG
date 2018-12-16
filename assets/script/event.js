window.EVENT_CODE = {
    EVENT_FOCUS_ROLE: 1000,
}

window.MyCustomEvent = {
    FocusRoleEvent: function (role) {
        this.event_type = EVENT_CODE.EVENT_FOCUS_ROLE;
        this.role = role;
    }
}