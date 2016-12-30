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
            (x: string, ...args: string[]) => `${args[0].toLowerCase()}${args[1] || ''}`);
        target.constructor['resolves'][resolveKey] = params && params.length > 0 ?
            params.concat(target[key]) : target[key];
    };
}

namespace route {
    export type RouteDataTypes = 'string' | 'int' | 'float' | 'boolean';

    export function query(dataType: RouteDataTypes = 'string', name?: string) {
        return resolveRoute(dataType, name);
    }

    export function param(dataType: RouteDataTypes = 'string', name?: string) {
        return resolveRoute(dataType, name);
    }

    function resolveRoute(dataType: RouteDataTypes, name: string) {
        return function(target: Object, key: string) {
            let finalKey: string = name || key;

            if (!target.constructor['bindings']) {
                target.constructor['bindings'] = {};
            }
            target.constructor['bindings'][key] = '<';

            if (!target.constructor['resolves']) {
                target.constructor['resolves'] = {};
            }
            target.constructor['resolves'][key] = [
                '$stateParams',
                ($stateParams: ng.ui.IStateParamsService): any =>
                    convert($stateParams[finalKey], dataType)
            ];
        }
    }

    export type RouteProperties = {[key: string]: RouteDataTypes};

    export function multiple(parameters: RouteProperties) {
        return function(target: Object, key: string) {
            if (!target.constructor['bindings']) {
                target.constructor['bindings'] = {};
            }
            target.constructor['bindings'][key] = '<';

            if (!target.constructor['resolves']) {
                target.constructor['resolves'] = {};
            }
            target.constructor['resolves'][key] = [
                '$stateParams',
                ($stateParams: ng.ui.IStateParamsService): {[name: string]: any} => {
                    function getRouteValues(definitions) {
                        let result: {[name: string]: any} = {};
                        for (let defnKey in definitions) {
                            if (definitions.hasOwnProperty(defnKey)) {
                                let key: string = _.startsWith(defnKey, '?') ? defnKey.substr(1) : defnKey;
                                let value: string = $stateParams[key];
                                result[_.camelCase(key)] = convert(value, definitions[defnKey]);
                            }
                        }
                        return result;
                    }

                    let result: {[name: string]: any} = getRouteValues(parameters);
                    return result;
                }
            ];
        };
    }

    function convert(value: string, dataType: RouteDataTypes): any {
        if (!value) {
            return undefined;
        }
        switch (dataType) {
            case 'int': return parseInt(value);
            case 'float': return parseFloat(value);
            case 'boolean': return Boolean(value.match(/^(true|yes|y|1)$/i));
            default: return value;
        }
    }
}
