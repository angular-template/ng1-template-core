

var ng1Template;
(function (ng1Template) {
    var core;
    (function (core) {
        core.coreModule = angular.module('ng1Template.core', []);
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
                var resolves_1 = route_1.resolve || {};
                var declaredResolves = reg.controller['resolves'] ? {} : undefined;
                if (declaredResolves) {
                    for (var r in reg.controller['resolves']) {
                        if (reg.controller['resolves'].hasOwnProperty(r)) {
                            resolves_1[r] = reg.controller['resolves'][r];
                        }
                    }
                }
                var resolveAttrs = [];
                if (route_1.resolve) {
                    for (var resolveKey in route_1.resolve) {
                        if (route_1.resolve.hasOwnProperty(resolveKey)) {
                            resolveAttrs.push(_.kebabCase(resolveKey) + "=\"$resolve." + resolveKey + "\"");
                        }
                    }
                }
                var template_1 = resolveAttrs.length === 0 ?
                    "<" + reg.name + "></" + reg.name + ">" :
                    "<" + reg.name + " " + resolveAttrs.join(' ') + "></" + reg.name + ">";
                module.config(['$stateProvider',
                    function ($stateProvider) {
                        //TODO: Use component field instead of template. Consult Sunny and see if component is available in current version of ui-router.
                        var state = {
                            name: reg.name,
                            template: template_1,
                            url: route_1.path,
                            resolve: resolves_1,
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
        function registerState(reg) {
            reg.module.service(_.camelCase(reg.name), reg.state);
        }
        core.registerState = registerState;
    })(core = ng1Template.core || (ng1Template.core = {}));
})(ng1Template || (ng1Template = {}));


function resolved(target, key) {
    if (!target.constructor['bindings']) {
        target.constructor['bindings'] = {};
    }
    target.constructor['bindings'][key] = '<';
}


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
        /**
         * Angular service that exposes the HTML5 local storage and session storage capabilities.
         */
        var StorageService = (function () {
            /* @ngInject */
            StorageService.$inject = ["$window"];
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
