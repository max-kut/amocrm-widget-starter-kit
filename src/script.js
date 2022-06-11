import {setDeps} from './dependensies';
import Widget from './Widget';

define(['jquery'], ($) => {
    setDeps({
        jQuery: $,
        $: $
    });
    return Widget;
});
