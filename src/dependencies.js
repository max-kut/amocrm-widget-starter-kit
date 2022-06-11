/**
 * Модуль для любых AMD-зависимостей, указанных в script.js
 */

const DEPENDENCIES = {};

export const setDeps = (deps = {}) => {
    Object.assign(DEPENDENCIES, deps)
}

export default DEPENDENCIES;