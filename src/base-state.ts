/// <reference path="../typings/index.d.ts"/>
/// <reference path="../typings/package.d.ts"/>

namespace ng1Template.core {
    /**
     * Base class for any state services.
     */
    export abstract class BaseState {
        private _storage: IStateStorage = {};

        constructor(storage: IStorageDescriptor[]) {
            if (typeof Storage === 'undefined') {
                throw Error(`This browser does not support local storage.`);
            }
            (storage || []).forEach((descriptor: IStorageDescriptor) => {
                this._storage[descriptor.name] = { type: descriptor.type };
            });
            this.initialize();
        }

        protected initialize(): void {
            //Optionally override in derived classes.
        }

        public clear(initialize: boolean = false): void {
            for (let item in this._storage) {
                if (this._storage.hasOwnProperty(item)) {
                    this.setState(item, null);
                }
            }
            if (initialize) {
                this.initialize();
            }
        }

        /**
         * Removes all items in the state and adds any item default back.
         */
        public reset(): void {
            this.clear(true);
        }

        protected setState<T>(name: string, value: T): void {
            let item: IStateStorageItem = this._storage[name];
            if (!item) {
                throw new Error(`Cannot find storage item named ${name}. Each item in state must be explicitly declared.`);
            }
            switch (item.type) {
                case StateType.inMemory:
                    item.value = value;
                    break;
                case StateType.session:
                    if (Boolean(value)) {
                        window.sessionStorage.setItem(name, JSON.stringify(value));
                    } else {
                        window.sessionStorage.removeItem(name);
                    }
                    break;
                case StateType.persisted:
                    if (Boolean(value)) {
                        window.localStorage.setItem(name, JSON.stringify(value));
                    } else {
                        window.localStorage.removeItem(name);
                    }
                    break;
                default:
                    console.error(`Don't know how to handle storage type ${item.type}.`);
                    break;
            }
        }

        protected getState<T>(name: string): T {
            let storage: IStateStorageItem = this._storage[name];
            if (!storage) {
                throw new Error(`Cannot find storage item named ${name}. Each item in state must be explicitly declared.`);
            }
            switch (storage.type) {
                case StateType.inMemory:
                    return storage.value;
                case StateType.session:
                    let sessionValue: string = window.sessionStorage.getItem(name);
                    return JSON.parse(sessionValue);
                case StateType.persisted:
                    let persistedValue: string = window.localStorage.getItem(name);
                    return JSON.parse(persistedValue);
                default:
                    console.error(`Don't know how to handle storage type ${storage.type}.`);
                    return storage.value;
            }
        }
    }

    interface IStateStorage {
        [name: string]: IStateStorageItem;
    }

    interface IStateStorageItem {
        type: StateType;
        value?: any;
    }

    export interface IStorageDescriptor {
        name: string;
        type: StateType;
    }

    export enum StateType {
        inMemory,
        session,
        persisted
    }
}
