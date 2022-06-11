export default class WidgetCallbacks {
    /** @type {Widget} */
    widget;

    constructor(widget) {
        this.widget = widget;
    }

    init() {
        return true;
    }

    render() {
        return true;
    }
    
    bind_actions() {
        return true;
    }

    settings($modalBody) {
        //
    }

    advancedSettings() {
        //
    }

    dpSettings() {
        //
    }

    async onSave({active, fields}) {
        console.log('--onSave', {this: this, active, fields});

        return true;
    }

    destroy() {
        // 
    }
}
