/// <reference path="../../typings/index.d.ts"/>
/// <reference path="../../typings/package.d.ts"/>
var ng1Template;
(function (ng1Template) {
    var core;
    (function (core) {
        function registerComponent(reg, module) {
            var finalTemplateUrlRoot = reg.templateUrlRoot || "/client/modules/" + module.name + "/";
            module.component(_.camelCase(reg.name), {
                templateUrl: "" + finalTemplateUrlRoot + reg.templateUrl,
                controller: reg.controller,
                controllerAs: _.camelCase(reg.name),
                bindings: reg.bindings
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
    })(core = ng1Template.core || (ng1Template.core = {}));
})(ng1Template || (ng1Template = {}));
