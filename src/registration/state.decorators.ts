/// <reference path="../../typings/index.d.ts"/>
/// <reference path="../../typings/package.d.ts"/>

namespace state {
    function getDecoratorFunction(type: number) {
        return function(target: Object, key: string) {
            delete target[key];
            let getterSetter: IGetterSetter = getGetterSetter(type, target, key);
            Object.defineProperty(target, key, {
                enumerable: true,
                configurable: true,
                get: getterSetter.getter,
                set: getterSetter.setter
            });
        }
    }

    function getGetterSetter(type: number, target: Object, key: string): IGetterSetter {
        switch (type) {
            case 1: return {
                getter: () => target[`_${key}`],
                setter: (value: any) => target[`_${key}`] = value
            };
            case 2: return undefined;
            case 3: return undefined;
            default: throw new Error(`Internal error. Unknown type ${type}`);
        }
    }

    export function inMemory() {
        return getDecoratorFunction(1);
    }

    export function session() {
        return getDecoratorFunction(2);
    }

    export function persisted() {
        return getDecoratorFunction(3);
    }

    interface IGetterSetter {
        getter: () => any;
        setter: (value: any) => void;
    }
}
