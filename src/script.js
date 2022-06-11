import {setDeps} from './dependencies';
import Widget from './Widget';

define(['jquery'], ($) => {
    setDeps({
        jQuery: $,
        $: $
    });
    return Widget;
});
