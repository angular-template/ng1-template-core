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
            case 2: return {
                getter: () => {
                    let value = window.sessionStorage.getItem(key);
                    if (value == undefined || value == null) {
                        return undefined;
                    }
                    try {
                        let result = JSON.parse(value);
                        return result;
                    } catch (e) {
                        return value;
                    }
                },
                setter: (value: any) => {
                    if (value == undefined || value == null) {
                        window.sessionStorage.removeItem(key);
                    } else {
                        window.sessionStorage.setItem(key, JSON.stringify(value));
                    }
                }
            };
            case 3: return {
                getter: () => {
                    let value = window.localStorage.getItem(key);
                    if (value == undefined || value == null) {
                        return undefined;
                    }
                    try {
                        let result = JSON.parse(value);
                        return result;
                    } catch (e) {
                        return value;
                    }
                },
                setter: (value: any) => {
                    if (value == undefined || value == null) {
                        window.localStorage.removeItem(key);
                    } else {
                        window.localStorage.setItem(key, JSON.stringify(value));
                    }
                }
            };
            default: throw new Error(`Internal error for @state decorator. Unknown type ${type}`);
        }
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
