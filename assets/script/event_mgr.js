function EventMgr() {

    this._event_handler_list = [];


    this.register_event = function (handler) {
        this._event_handler_list.push(handler);
    }

    this.unregister_event = function (handler) {
        for(let i = 0; i < this._event_handler_list.length; i++){
            if(this._event_handler_list[i] == handler){
                this._event_handler_list.splice(i, 1);
            }
        }
    }

    this.fire = function(ev){
        for (const key in this._event_handler_list) {
            if (this._event_handler_list.hasOwnProperty(key)) {
                this._event_handler_list[key](ev);
            }
        }
    }
}



window.event_mgr = new EventMgr();