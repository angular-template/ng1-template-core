/// <reference path="../../typings/index.d.ts"/>
/// <reference path="../../typings/package.d.ts"/>

function resolved(target: Object, key: string) {
    if (!target.constructor['bindings']) {
        target.constructor['bindings'] = {};
    }
    target.constructor['bindings'][key] = '<';
}

function resolver(params?: string[]) {
    return function(target: Object, key: string, descriptor: PropertyDescriptor) {
        if (typeof target !== 'object') {
            throw new Error(`Resolver method ${key} should be an instance method.`)
        }
        if (!_.startsWith(key, 'resolve')) {
            throw new Error(`Resolver method ${key} is invalid as it does not start with 'resolve'.`);
        }
        if (!target.constructor['resolves']) {
            target.constructor['resolves'] = {};
        }
        let resolveKey: string = key.replace(/^resolve(\w)(\w+)?$/,
            (x: string, ...args: string[]) => `${args[1].toLowerCase()}${args[2] || ''}`);
        target.constructor['resolves'][resolveKey] = params && params.length > 0 ?
            params.concat(target[key]) : target[key];
    };
}
