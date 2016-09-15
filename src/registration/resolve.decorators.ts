/// <reference path="../../typings/index.d.ts"/>
/// <reference path="../../typings/package.d.ts"/>

function resolved() {
    return function (target: Object, key: string) {
        if (!target.constructor['bindings']) {
            target.constructor['bindings'] = {};
        }
        target.constructor['bindings'][key] = '<';
    }
}
