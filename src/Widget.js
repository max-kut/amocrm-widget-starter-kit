import WidgetCallbacks from './WidgetCallbacks';

/**
 * Не стоит объявлять как класс,
 * т.к. amoCRM делает инъекцию в прототип системных методов
 */
const Widget = function () {
    this.callbacks = new WidgetCallbacks(this);
};

export default Widget;
