namespace bind {
    function getDecoratorFunction(binding: string) {
        return function (target: Object, key: string) {
            if (!target.constructor['bindings']) {
                target.constructor['bindings'] = {};
            }
            target.constructor['bindings'][key] = binding;
        }
    }

    export function oneWay() {
        return getDecoratorFunction('<');
    }

    export function twoWay() {
        return getDecoratorFunction('=');
    }

    export function string() {
        return getDecoratorFunction('@');
    }

    export function event() {
        return getDecoratorFunction('&');
    }
}
