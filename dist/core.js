var ng1Template;
(function (ng1Template) {
    var core;
    (function (core) {
        core.coreModule = angular.module('ng1Template.core', []);
    })(core = ng1Template.core || (ng1Template.core = {}));
})(ng1Template || (ng1Template = {}));
var ng1Template;
(function (ng1Template) {
    var core;
    (function (core) {
        var StorageService = (function () {
            function StorageService($window) {
                this.$window = $window;
                if (typeof Storage === 'undefined') {
                    throw Error("This browser does not support local or session storage.");
                }
            }
            StorageService.prototype.getLocal = function (key) {
                return angular.fromJson(this.$window.localStorage.getItem(key));
            };
            StorageService.prototype.getSession = function (key) {
                return angular.fromJson(this.$window.sessionStorage.getItem(key));
            };
            StorageService.prototype.removeLocal = function (key) {
                this.$window.localStorage.removeItem(key);
            };
            StorageService.prototype.removeSession = function (key) {
                this.$window.sessionStorage.removeItem(key);
            };
            StorageService.prototype.setLocal = function (key, value) {
                this.$window.localStorage.setItem(key, angular.toJson(value));
            };
            StorageService.prototype.setSession = function (key, value) {
                this.$window.sessionStorage.setItem(key, angular.toJson(value));
            };
            return StorageService;
        }());
        core.StorageService = StorageService;
        core.coreModule.service('storageService', StorageService);
    })(core = ng1Template.core || (ng1Template.core = {}));
})(ng1Template || (ng1Template = {}));
var bind;
(function (bind) {
    function getDecoratorFunction(binding) {
        return function (target, key) {
            if (!target.constructor['bindings']) {
                target.constructor['bindings'] = {};
            }
            target.constructor['bindings'][key] = binding;
        };
    }
    function oneWay() {
        return getDecoratorFunction('<');
    }
    bind.oneWay = oneWay;
    function twoWay() {
        return getDecoratorFunction('=');
    }
    bind.twoWay = twoWay;
    function string() {
        return getDecoratorFunction('@');
    }
    bind.string = string;
    function event() {
        return getDecoratorFunction('&');
    }
    bind.event = event;
})(bind || (bind = {}));
var ng1Template;
(function (ng1Template) {
    var core;
    (function (core) {
        function registerComponent(reg, module) {
            var templateUrlRoot = reg.templateUrlRoot || "/client/modules/" + module.name + "/";
            var templateUrl = reg.templateUrl || reg.name + "/" + reg.name + ".html";
            var bindings = reg.controller['bindings'] ? {} : undefined;
            if (bindings) {
                for (var b in reg.controller['bindings']) {
                    if (reg.controller['bindings'].hasOwnProperty(b)) {
                        bindings[b] = reg.controller['bindings'][b];
                    }
                }
            }
            module.component(_.camelCase(reg.name), {
                templateUrl: "" + templateUrlRoot + templateUrl,
                controller: reg.controller,
                controllerAs: _.camelCase(reg.name),
                bindings: bindings
            });
            if (reg.route) {
                var route_1 = reg.route;
                module.config(['$stateProvider',
                    function ($stateProvider) {
                        var state = {
                            name: reg.name,
                            template: "<" + reg.name + "></" + reg.name + ">",
                            url: route_1.path,
                            resolve: route_1.resolve,
                            params: route_1.params
                        };
                        if (route_1.abstract !== undefined) {
                            state.abstract = route_1.abstract;
                        }
                        if (route_1.parent) {
                            var parent_1 = route_1.parent;
                            if (typeof parent_1 === 'string') {
                                state.parent = parent_1;
                            }
                            else {
                                state.parent = parent_1.name;
                            }
                        }
                        $stateProvider.state(state);
                    }
                ]);
            }
        }
        core.registerComponent = registerComponent;
        function registerLayout(reg, module) {
            registerComponent({
                name: reg.name,
                controller: reg.controller,
                templateUrl: reg.templateUrl,
                templateUrlRoot: reg.templateUrlRoot,
                route: {
                    abstract: true,
                    path: '^'
                }
            }, module);
        }
        core.registerLayout = registerLayout;
        function registerService(reg) {
            reg.module.service(_.camelCase(reg.name), reg.service);
        }
        core.registerService = registerService;
    })(core = ng1Template.core || (ng1Template.core = {}));
})(ng1Template || (ng1Template = {}));
var state;
(function (state) {
    function getDecoratorFunction(type) {
        return function (target, key) {
            delete target[key];
            var getterSetter = getGetterSetter(type, target, key);
            Object.defineProperty(target, key, {
                enumerable: true,
                configurable: true,
                get: getterSetter.getter,
                set: getterSetter.setter
            });
        };
    }
    function getGetterSetter(type, target, key) {
        switch (type) {
            case 1: return {
                getter: function () { return target[("_" + key)]; },
                setter: function (value) { return target[("_" + key)] = value; }
            };
            case 2: return {
                getter: function () { return JSON.parse(window.sessionStorage.getItem(key)); },
                setter: function (value) { return window.sessionStorage.setItem(key, JSON.stringify(value)); }
            };
            case 3: return {
                getter: function () { return JSON.parse(window.localStorage.getItem(key)); },
                setter: function (value) { return window.localStorage.setItem(key, JSON.stringify(value)); }
            };
            default: throw new Error("Internal error. Unknown type " + type);
        }
    }
    function inMemory() {
        return getDecoratorFunction(1);
    }
    state.inMemory = inMemory;
    function session() {
        return getDecoratorFunction(2);
    }
    state.session = session;
    function persisted() {
        return getDecoratorFunction(3);
    }
    state.persisted = persisted;
})(state || (state = {}));
var ng1Template;
(function (ng1Template) {
    var core;
    (function (core) {
        var BaseState = (function () {
            function BaseState(storage) {
                var _this = this;
                this._storage = {};
                if (typeof Storage === 'undefined') {
                    throw Error("This browser does not support local storage.");
                }
                (storage || []).forEach(function (descriptor) {
                    _this._storage[descriptor.name] = { type: descriptor.type };
                });
                this.initialize();
            }
            BaseState.prototype.initialize = function () {
            };
            BaseState.prototype.clear = function (initialize) {
                if (initialize === void 0) { initialize = false; }
                for (var item in this._storage) {
                    if (this._storage.hasOwnProperty(item)) {
                        this.setState(item, null);
                    }
                }
                if (initialize) {
                    this.initialize();
                }
            };
            BaseState.prototype.reset = function () {
                this.clear(true);
            };
            BaseState.prototype.setState = function (name, value) {
                var item = this._storage[name];
                if (!item) {
                    throw new Error("Cannot find storage item named " + name + ". Each item in state must be explicitly declared.");
                }
                switch (item.type) {
                    case StateType.inMemory:
                        item.value = value;
                        break;
                    case StateType.session:
                        if (Boolean(value)) {
                            window.sessionStorage.setItem(name, JSON.stringify(value));
                        }
                        else {
                            window.sessionStorage.removeItem(name);
                        }
                        break;
                    case StateType.persisted:
                        if (Boolean(value)) {
                            window.localStorage.setItem(name, JSON.stringify(value));
                        }
                        else {
                            window.localStorage.removeItem(name);
                        }
                        break;
                    default:
                        console.error("Don't know how to handle storage type " + item.type + ".");
                        break;
                }
            };
            BaseState.prototype.getState = function (name) {
                var storage = this._storage[name];
                if (!storage) {
                    throw new Error("Cannot find storage item named " + name + ". Each item in state must be explicitly declared.");
                }
                switch (storage.type) {
                    case StateType.inMemory:
                        return storage.value;
                    case StateType.session:
                        var sessionValue = window.sessionStorage.getItem(name);
                        return JSON.parse(sessionValue);
                    case StateType.persisted:
                        var persistedValue = window.localStorage.getItem(name);
                        return JSON.parse(persistedValue);
                    default:
                        console.error("Don't know how to handle storage type " + storage.type + ".");
                        return storage.value;
                }
            };
            return BaseState;
        }());
        core.BaseState = BaseState;
        (function (StateType) {
            StateType[StateType["inMemory"] = 0] = "inMemory";
            StateType[StateType["session"] = 1] = "session";
            StateType[StateType["persisted"] = 2] = "persisted";
        })(core.StateType || (core.StateType = {}));
        var StateType = core.StateType;
    })(core = ng1Template.core || (ng1Template.core = {}));
})(ng1Template || (ng1Template = {}));
