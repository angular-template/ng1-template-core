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
            case 2: return {
                getter: () => {
                    let value = window.sessionStorage.getItem(key);
                    return value == undefined || value == null ? undefined : JSON.parse(window.sessionStorage.getItem(key))
                },
                setter: (value: any) => {
                    if (key == undefined || key == null) {
                        window.sessionStorage.removeItem(key);
                    } else {
                        window.sessionStorage.setItem(key, JSON.stringify(value));
                    }
                }
            };
            case 3: return {
                getter: () => JSON.parse(window.localStorage.getItem(key)),
                setter: (value: any) => window.localStorage.setItem(key, JSON.stringify(value))
            };
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
