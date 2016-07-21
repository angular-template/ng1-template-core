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
var ng1Template;
(function (ng1Template) {
    var core;
    (function (core) {
        core.coreModule = angular.module('ng1Template.core', []);
    })(core = ng1Template.core || (ng1Template.core = {}));
})(ng1Template || (ng1Template = {}));
