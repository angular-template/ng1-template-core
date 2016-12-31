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
function resolved(target, key) {
    if (!target.constructor['bindings']) {
        target.constructor['bindings'] = {};
    }
    target.constructor['bindings'][key] = '<';
}
function resolver(params) {
    return function (target, key, descriptor) {
        if (typeof target !== 'object') {
            throw new Error("Resolver method " + key + " should be an instance method.");
        }
        if (!_.startsWith(key, 'resolve')) {
            throw new Error("Resolver method " + key + " is invalid as it does not start with 'resolve'.");
        }
        if (!target.constructor['resolves']) {
            target.constructor['resolves'] = {};
        }
        var resolveKey = key.replace(/^resolve(\w)(\w+)?$/, function (x) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return "" + args[0].toLowerCase() + (args[1] || '');
        });
        target.constructor['resolves'][resolveKey] = params && params.length > 0 ?
            params.concat(target[key]) : target[key];
    };
}
var route;
(function (route) {
    function query(dataType, name) {
        if (dataType === void 0) { dataType = 'string'; }
        return resolveRoute(dataType, name);
    }
    route.query = query;
    function param(dataType, name) {
        if (dataType === void 0) { dataType = 'string'; }
        return resolveRoute(dataType, name);
    }
    route.param = param;
    function resolveRoute(dataType, name) {
        return function (target, key) {
            var finalKey = name || key;
            if (!target.constructor['bindings']) {
                target.constructor['bindings'] = {};
            }
            target.constructor['bindings'][key] = '<';
            if (!target.constructor['resolves']) {
                target.constructor['resolves'] = {};
            }
            target.constructor['resolves'][key] = [
                '$stateParams',
                function ($stateParams) {
                    return convert($stateParams[finalKey], dataType);
                }
            ];
        };
    }
    function multiple(parameters) {
        return function (target, key) {
            if (!target.constructor['bindings']) {
                target.constructor['bindings'] = {};
            }
            target.constructor['bindings'][key] = '<';
            if (!target.constructor['resolves']) {
                target.constructor['resolves'] = {};
            }
            target.constructor['resolves'][key] = [
                '$stateParams',
                function ($stateParams) {
                    function getRouteValues(definitions) {
                        var result = {};
                        for (var defnKey in definitions) {
                            if (definitions.hasOwnProperty(defnKey)) {
                                var key_1 = _.startsWith(defnKey, '?') ? defnKey.substr(1) : defnKey;
                                var value = $stateParams[key_1];
                                result[_.camelCase(key_1)] = convert(value, definitions[defnKey]);
                            }
                        }
                        return result;
                    }
                    var result = getRouteValues(parameters);
                    return result;
                }
            ];
        };
    }
    route.multiple = multiple;
    function convert(value, dataType) {
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
})(route || (route = {}));
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
            case 2: return {
                getter: function () {
                    var value = window.sessionStorage.getItem(key);
                    if (value == undefined || value == null) {
                        return undefined;
                    }
                    try {
                        var result = JSON.parse(value);
                        return result;
                    }
                    catch (e) {
                        return value;
                    }
                },
                setter: function (value) {
                    if (value == undefined || value == null) {
                        window.sessionStorage.removeItem(key);
                    }
                    else {
                        window.sessionStorage.setItem(key, JSON.stringify(value));
                    }
                }
            };
            case 3: return {
                getter: function () {
                    var value = window.localStorage.getItem(key);
                    if (value == undefined || value == null) {
                        return undefined;
                    }
                    try {
                        var result = JSON.parse(value);
                        return result;
                    }
                    catch (e) {
                        return value;
                    }
                },
                setter: function (value) {
                    if (value == undefined || value == null) {
                        window.localStorage.removeItem(key);
                    }
                    else {
                        window.localStorage.setItem(key, JSON.stringify(value));
                    }
                }
            };
            default: throw new Error("Internal error for @state decorator. Unknown type " + type);
        }
    }
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
        function registerComponent(reg, module) {
            //Provide default for templateUrlRoot, if not specified, and ensure it starts and ends with a '/'.
            var templateUrlRoot = reg.templateUrlRoot || "/client/modules/" + module.name + "/";
            if (!_.startsWith(templateUrlRoot, '/')) {
                templateUrlRoot = '/' + templateUrlRoot;
            }
            if (!_.endsWith(templateUrlRoot, '/')) {
                templateUrlRoot += '/';
            }
            //TODO: Template URL root should start and end with '/'
            //Provide default for templateUrl, if not specified, and ensure that it does not start with a '/'.
            var templateUrl = reg.templateUrl || reg.name + "/" + reg.name + ".html";
            if (_.startsWith(templateUrl, '/')) {
                templateUrl = templateUrl.substr(1);
            }
            //Read the bindings declared using the @bind decorators and add them to an object.
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
                //Read the resolves declared using the @resolved and @resolver decorators and add them
                //to any existing resolves declared as part of the @Page declaration.
                var resolves_1 = route_1.resolve || {};
                var declaredResolves = reg.controller['resolves'] ? {} : undefined;
                if (declaredResolves) {
                    for (var r in reg.controller['resolves']) {
                        if (reg.controller['resolves'].hasOwnProperty(r)) {
                            resolves_1[r] = reg.controller['resolves'][r];
                        }
                    }
                }
                //From the full set of resolves, build the attribute string to add to the template string.
                var resolveAttrs = [];
                if (resolves_1) {
                    for (var resolveKey in resolves_1) {
                        if (resolves_1.hasOwnProperty(resolveKey)) {
                            resolveAttrs.push(_.kebabCase(resolveKey) + "=\"$resolve." + resolveKey + "\"");
                        }
                    }
                }
                var template_1 = resolveAttrs.length === 0 ?
                    "<" + reg.name + "></" + reg.name + ">" :
                    "<" + reg.name + " " + resolveAttrs.join(' ') + "></" + reg.name + ">";
                module.config(['$stateProvider',
                    function ($stateProvider) {
                        //Ensure route path specified and starts with a '/'
                        var routePath = route_1.path;
                        if (!routePath) {
                            throw new Error("Specify a route path for the page " + reg.name + ".");
                        }
                        if (routePath !== '^' && !_.startsWith(routePath, '/')) {
                            routePath = '/' + routePath;
                        }
                        //TODO: Use component field instead of template. Consult Sunny and see if component is available in current version of ui-router.
                        var state = {
                            name: reg.name,
                            template: template_1,
                            url: routePath,
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
            var matches = reg.name.match(/^(\w+)-layout$/);
            var layoutName = matches ? matches[1] : reg.name;
            var templateUrl = reg.templateUrl || "layouts/" + layoutName + "/" + layoutName + ".html";
            registerComponent({
                name: reg.name,
                controller: reg.controller,
                templateUrl: templateUrl,
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
var ng1Template;
(function (ng1Template) {
    var core;
    (function (core) {
        /**
         * Angular service that exposes the HTML5 local storage and session storage capabilities.
         */
        var StorageService = (function () {
            function StorageService($window) {
                this.$window = $window;
                if (typeof Storage === 'undefined') {
                    throw new Error("This browser does not support local or session storage.");
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
        StorageService.$inject = ['$window'];
        core.StorageService = StorageService;
        core.coreModule.service('storageService', StorageService);
    })(core = ng1Template.core || (ng1Template.core = {}));
})(ng1Template || (ng1Template = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcmMvbW9kdWxlLnRzIiwic3JjL2RlY29yYXRvci50eXBlcy50cyIsInNyYy9kZWNvcmF0b3JzL2JpbmRpbmcuZGVjb3JhdG9ycy50cyIsInNyYy9kZWNvcmF0b3JzL3Jlc29sdmUuZGVjb3JhdG9ycy50cyIsInNyYy9kZWNvcmF0b3JzL3N0YXRlLmRlY29yYXRvcnMudHMiLCJzcmMvcmVnaXN0cmF0aW9uL2Z1bmN0aW9ucy50cyIsInNyYy9yZWdpc3RyYXRpb24vcmVnaXN0cmF0aW9uLnR5cGVzLnRzIiwic3JjL3NlcnZpY2VzL3N0b3JhZ2Uuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFVLFdBQVcsQ0FFcEI7QUFGRCxXQUFVLFdBQVc7SUFBQyxJQUFBLElBQUksQ0FFekI7SUFGcUIsV0FBQSxJQUFJO1FBQ1QsZUFBVSxHQUFlLE9BQU8sQ0FBQyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDakYsQ0FBQyxFQUZxQixJQUFJLEdBQUosZ0JBQUksS0FBSixnQkFBSSxRQUV6QjtBQUFELENBQUMsRUFGUyxXQUFXLEtBQVgsV0FBVyxRQUVwQjtBRUZELElBQVUsSUFBSSxDQXlCYjtBQXpCRCxXQUFVLElBQUk7SUFDViw4QkFBOEIsT0FBZTtRQUN6QyxNQUFNLENBQUMsVUFBVSxNQUFjLEVBQUUsR0FBVztZQUN4QyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsQyxNQUFNLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUN4QyxDQUFDO1lBQ0QsTUFBTSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUM7UUFDbEQsQ0FBQyxDQUFBO0lBQ0wsQ0FBQztJQUVEO1FBQ0ksTUFBTSxDQUFD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O1FBRUQsS0FBQSxVQUFVLENBQUMsT0FBTyxDQUFDLGdCQUFnQixFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBQ3pELENBQUMsRUF2Q3FCLElBQUksR0FBSixnQkFBSSxLQUFKLGdCQUFJLFFBdUN6QjtBQUFELENBQUMsRUF2Q1MsV0FBVyxLQUFYLFdBQVcsUUF1Q3BCIiwic291cmNlc0NvbnRlbnQiOlsibmFtZXNwYWNlIG5nMVRlbXBsYXRlLmNvcmUge1xyXG4gICAgZXhwb3J0IGNvbnN0IGNvcmVNb2R1bGU6IG5nLklNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnbmcxVGVtcGxhdGUuY29yZScsIFtdKTtcclxufVxyXG4iLCJuYW1lc3BhY2UgbmcxVGVtcGxhdGUuY29yZSB7XHJcbiAgICAvKipcclxuICAgICAqIFJlcHJlc2VudHMgYSBkZWNvcmF0b3IgZnVuY3Rpb24gZm9yIGEgY2xhc3MuXHJcbiAgICAgKiBAcGFyYW0gdGFyZ2V0IFRoZSBjb25zdHJ1Y3RvciBmdW5jdGlvbiBvZiB0aGUgY2xhc3MuXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCB0eXBlIENsYXNzRGVjb3JhdG9yID0gKHRhcmdldDogRnVuY3Rpb24pID0+IHZvaWQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEZXRhaWxzIHJlcXVpcmVkIGJ5IHRoZSBjb21wb25lbnQgZGVjb3JhdG9yIHRvIHJlZ2lzdGVyIGEgY29tcG9uZW50LlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElDb21wb25lbnREZXRhaWxzIHtcclxuICAgICAgICBzZWxlY3Rvcjogc3RyaW5nO1xyXG4gICAgICAgIHRlbXBsYXRlVXJsPzogc3RyaW5nO1xyXG4gICAgICAgIHRlbXBsYXRlVXJsUm9vdD86IHN0cmluZztcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgdHlwZSBDb21wb25lbnREZWNvcmF0b3JGYWN0b3J5ID0gKGRldGFpbHM6IElDb21wb25lbnREZXRhaWxzKSA9PiBDbGFzc0RlY29yYXRvcjtcclxuICAgIGV4cG9ydCB0eXBlIFBhZ2VEZWNvcmF0b3JGYWN0b3J5ID0gKGRldGFpbHM6IElDb21wb25lbnREZXRhaWxzLCByb3V0ZTogSUNvbXBvbmVudFJvdXRlKSA9PiBDbGFzc0RlY29yYXRvcjtcclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElMYXlvdXREZXRhaWxzIHtcclxuICAgICAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICAgICAgdGVtcGxhdGVVcmw/OiBzdHJpbmc7XHJcbiAgICAgICAgdGVtcGxhdGVVcmxSb290Pzogc3RyaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCB0eXBlIExheW91dERlY29yYXRvckZhY3RvcnkgPSAoZGV0YWlsczogSUxheW91dERldGFpbHMpID0+IENsYXNzRGVjb3JhdG9yO1xyXG5cclxuICAgIGV4cG9ydCB0eXBlIFNlcnZpY2VEZWNvcmF0b3JGYWN0b3J5ID0gKG5hbWU6IHN0cmluZykgPT4gQ2xhc3NEZWNvcmF0b3I7XHJcbn1cclxuIiwibmFtZXNwYWNlIGJpbmQge1xyXG4gICAgZnVuY3Rpb24gZ2V0RGVjb3JhdG9yRnVuY3Rpb24oYmluZGluZzogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQ6IE9iamVjdCwga2V5OiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgaWYgKCF0YXJnZXQuY29uc3RydWN0b3JbJ2JpbmRpbmdzJ10pIHtcclxuICAgICAgICAgICAgICAgIHRhcmdldC5jb25zdHJ1Y3RvclsnYmluZGluZ3MnXSA9IHt9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRhcmdldC5jb25zdHJ1Y3RvclsnYmluZGluZ3MnXVtrZXldID0gYmluZGluZztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIG9uZVdheSgpIHtcclxuICAgICAgICByZXR1cm4gZ2V0RGVjb3JhdG9yRnVuY3Rpb24oJzwnKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gdHdvV2F5KCkge1xyXG4gICAgICAgIHJldHVybiBnZXREZWNvcmF0b3JGdW5jdGlvbignPScpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBzdHJpbmcoKSB7XHJcbiAgICAgICAgcmV0dXJuIGdldERlY29yYXRvckZ1bmN0aW9uKCdAJyk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGV2ZW50KCkge1xyXG4gICAgICAgIHJldHVybiBnZXREZWNvcmF0b3JGdW5jdGlvbignJicpO1xyXG4gICAgfVxyXG59XHJcbiIsImZ1bmN0aW9uIHJlc29sdmVkKHRhcmdldDogT2JqZWN0LCBrZXk6IHN0cmluZykge1xyXG4gICAgaWYgKCF0YXJnZXQuY29uc3RydWN0b3JbJ2JpbmRpbmdzJ10pIHtcclxuICAgICAgICB0YXJnZXQuY29uc3RydWN0b3JbJ2JpbmRpbmdzJ10gPSB7fTtcclxuICAgIH1cclxuICAgIHRhcmdldC5jb25zdHJ1Y3RvclsnYmluZGluZ3MnXVtrZXldID0gJzwnO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZXNvbHZlcihwYXJhbXM/OiBzdHJpbmdbXSkge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKHRhcmdldDogT2JqZWN0LCBrZXk6IHN0cmluZywgZGVzY3JpcHRvcjogUHJvcGVydHlEZXNjcmlwdG9yKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXQgIT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgUmVzb2x2ZXIgbWV0aG9kICR7a2V5fSBzaG91bGQgYmUgYW4gaW5zdGFuY2UgbWV0aG9kLmApXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghXy5zdGFydHNXaXRoKGtleSwgJ3Jlc29sdmUnKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFJlc29sdmVyIG1ldGhvZCAke2tleX0gaXMgaW52YWxpZCBhcyBpdCBkb2VzIG5vdCBzdGFydCB3aXRoICdyZXNvbHZlJy5gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0YXJnZXQuY29uc3RydWN0b3JbJ3Jlc29sdmVzJ10pIHtcclxuICAgICAgICAgICAgdGFyZ2V0LmNvbnN0cnVjdG9yWydyZXNvbHZlcyddID0ge307XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCByZXNvbHZlS2V5OiBzdHJpbmcgPSBrZXkucmVwbGFjZSgvXnJlc29sdmUoXFx3KShcXHcrKT8kLyxcclxuICAgICAgICAgICAgKHg6IHN0cmluZywgLi4uYXJnczogc3RyaW5nW10pID0+IGAke2FyZ3NbMF0udG9Mb3dlckNhc2UoKX0ke2FyZ3NbMV0gfHwgJyd9YCk7XHJcbiAgICAgICAgdGFyZ2V0LmNvbnN0cnVjdG9yWydyZXNvbHZlcyddW3Jlc29sdmVLZXldID0gcGFyYW1zICYmIHBhcmFtcy5sZW5ndGggPiAwID9cclxuICAgICAgICAgICAgcGFyYW1zLmNvbmNhdCh0YXJnZXRba2V5XSkgOiB0YXJnZXRba2V5XTtcclxuICAgIH07XHJcbn1cclxuXHJcbm5hbWVzcGFjZSByb3V0ZSB7XHJcbiAgICBleHBvcnQgdHlwZSBSb3V0ZURhdGFUeXBlcyA9ICdzdHJpbmcnIHwgJ2ludCcgfCAnZmxvYXQnIHwgJ2Jvb2xlYW4nO1xyXG5cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBxdWVyeShkYXRhVHlwZTogUm91dGVEYXRhVHlwZXMgPSAnc3RyaW5nJywgbmFtZT86IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiByZXNvbHZlUm91dGUoZGF0YVR5cGUsIG5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBwYXJhbShkYXRhVHlwZTogUm91dGVEYXRhVHlwZXMgPSAnc3RyaW5nJywgbmFtZT86IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiByZXNvbHZlUm91dGUoZGF0YVR5cGUsIG5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHJlc29sdmVSb3V0ZShkYXRhVHlwZTogUm91dGVEYXRhVHlwZXMsIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbih0YXJnZXQ6IE9iamVjdCwga2V5OiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgbGV0IGZpbmFsS2V5OiBzdHJpbmcgPSBuYW1lIHx8IGtleTtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGFyZ2V0LmNvbnN0cnVjdG9yWydiaW5kaW5ncyddKSB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQuY29uc3RydWN0b3JbJ2JpbmRpbmdzJ10gPSB7fTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0YXJnZXQuY29uc3RydWN0b3JbJ2JpbmRpbmdzJ11ba2V5XSA9ICc8JztcclxuXHJcbiAgICAgICAgICAgIGlmICghdGFyZ2V0LmNvbnN0cnVjdG9yWydyZXNvbHZlcyddKSB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQuY29uc3RydWN0b3JbJ3Jlc29sdmVzJ10gPSB7fTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0YXJnZXQuY29uc3RydWN0b3JbJ3Jlc29sdmVzJ11ba2V5XSA9IFtcclxuICAgICAgICAgICAgICAgICckc3RhdGVQYXJhbXMnLFxyXG4gICAgICAgICAgICAgICAgKCRzdGF0ZVBhcmFtczogbmcudWkuSVN0YXRlUGFyYW1zU2VydmljZSk6IGFueSA9PlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnZlcnQoJHN0YXRlUGFyYW1zW2ZpbmFsS2V5XSwgZGF0YVR5cGUpXHJcbiAgICAgICAgICAgIF07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCB0eXBlIFJvdXRlUHJvcGVydGllcyA9IHtba2V5OiBzdHJpbmddOiBSb3V0ZURhdGFUeXBlc307XHJcblxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIG11bHRpcGxlKHBhcmFtZXRlcnM6IFJvdXRlUHJvcGVydGllcykge1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbih0YXJnZXQ6IE9iamVjdCwga2V5OiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgaWYgKCF0YXJnZXQuY29uc3RydWN0b3JbJ2JpbmRpbmdzJ10pIHtcclxuICAgICAgICAgICAgICAgIHRhcmdldC5jb25zdHJ1Y3RvclsnYmluZGluZ3MnXSA9IHt9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRhcmdldC5jb25zdHJ1Y3RvclsnYmluZGluZ3MnXVtrZXldID0gJzwnO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0YXJnZXQuY29uc3RydWN0b3JbJ3Jlc29sdmVzJ10pIHtcclxuICAgICAgICAgICAgICAgIHRhcmdldC5jb25zdHJ1Y3RvclsncmVzb2x2ZXMnXSA9IHt9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRhcmdldC5jb25zdHJ1Y3RvclsncmVzb2x2ZXMnXVtrZXldID0gW1xyXG4gICAgICAgICAgICAgICAgJyRzdGF0ZVBhcmFtcycsXHJcbiAgICAgICAgICAgICAgICAoJHN0YXRlUGFyYW1zOiBuZy51aS5JU3RhdGVQYXJhbXNTZXJ2aWNlKToge1tuYW1lOiBzdHJpbmddOiBhbnl9ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBnZXRSb3V0ZVZhbHVlcyhkZWZpbml0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzdWx0OiB7W25hbWU6IHN0cmluZ106IGFueX0gPSB7fTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgZGVmbktleSBpbiBkZWZpbml0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRlZmluaXRpb25zLmhhc093blByb3BlcnR5KGRlZm5LZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGtleTogc3RyaW5nID0gXy5zdGFydHNXaXRoKGRlZm5LZXksICc/JykgPyBkZWZuS2V5LnN1YnN0cigxKSA6IGRlZm5LZXk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHZhbHVlOiBzdHJpbmcgPSAkc3RhdGVQYXJhbXNba2V5XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbXy5jYW1lbENhc2Uoa2V5KV0gPSBjb252ZXJ0KHZhbHVlLCBkZWZpbml0aW9uc1tkZWZuS2V5XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCByZXN1bHQ6IHtbbmFtZTogc3RyaW5nXTogYW55fSA9IGdldFJvdXRlVmFsdWVzKHBhcmFtZXRlcnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF07XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjb252ZXJ0KHZhbHVlOiBzdHJpbmcsIGRhdGFUeXBlOiBSb3V0ZURhdGFUeXBlcyk6IGFueSB7XHJcbiAgICAgICAgaWYgKCF2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzd2l0Y2ggKGRhdGFUeXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ2ludCc6IHJldHVybiBwYXJzZUludCh2YWx1ZSk7XHJcbiAgICAgICAgICAgIGNhc2UgJ2Zsb2F0JzogcmV0dXJuIHBhcnNlRmxvYXQodmFsdWUpO1xyXG4gICAgICAgICAgICBjYXNlICdib29sZWFuJzogcmV0dXJuIEJvb2xlYW4odmFsdWUubWF0Y2goL14odHJ1ZXx5ZXN8eXwxKSQvaSkpO1xyXG4gICAgICAgICAgICBkZWZhdWx0OiByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBzdGF0ZSB7XHJcbiAgICBmdW5jdGlvbiBnZXREZWNvcmF0b3JGdW5jdGlvbih0eXBlOiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24odGFyZ2V0OiBPYmplY3QsIGtleTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGRlbGV0ZSB0YXJnZXRba2V5XTtcclxuICAgICAgICAgICAgbGV0IGdldHRlclNldHRlcjogSUdldHRlclNldHRlciA9IGdldEdldHRlclNldHRlcih0eXBlLCB0YXJnZXQsIGtleSk7XHJcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwge1xyXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGdldDogZ2V0dGVyU2V0dGVyLmdldHRlcixcclxuICAgICAgICAgICAgICAgIHNldDogZ2V0dGVyU2V0dGVyLnNldHRlclxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0R2V0dGVyU2V0dGVyKHR5cGU6IG51bWJlciwgdGFyZ2V0OiBPYmplY3QsIGtleTogc3RyaW5nKTogSUdldHRlclNldHRlciB7XHJcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMjogcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGdldHRlcjogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IHdpbmRvdy5zZXNzaW9uU3RvcmFnZS5nZXRJdGVtKGtleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlID09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXN1bHQgPSBKU09OLnBhcnNlKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc2V0dGVyOiAodmFsdWU6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PSB1bmRlZmluZWQgfHwgdmFsdWUgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5zZXNzaW9uU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkodmFsdWUpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGNhc2UgMzogcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGdldHRlcjogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PSB1bmRlZmluZWQgfHwgdmFsdWUgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0gSlNPTi5wYXJzZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNldHRlcjogKHZhbHVlOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT0gdW5kZWZpbmVkIHx8IHZhbHVlID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGtleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkodmFsdWUpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IHRocm93IG5ldyBFcnJvcihgSW50ZXJuYWwgZXJyb3IgZm9yIEBzdGF0ZSBkZWNvcmF0b3IuIFVua25vd24gdHlwZSAke3R5cGV9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBzZXNzaW9uKCkge1xyXG4gICAgICAgIHJldHVybiBnZXREZWNvcmF0b3JGdW5jdGlvbigyKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gcGVyc2lzdGVkKCkge1xyXG4gICAgICAgIHJldHVybiBnZXREZWNvcmF0b3JGdW5jdGlvbigzKTtcclxuICAgIH1cclxuXHJcbiAgICBpbnRlcmZhY2UgSUdldHRlclNldHRlciB7XHJcbiAgICAgICAgZ2V0dGVyOiAoKSA9PiBhbnk7XHJcbiAgICAgICAgc2V0dGVyOiAodmFsdWU6IGFueSkgPT4gdm9pZDtcclxuICAgIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgbmcxVGVtcGxhdGUuY29yZSB7XHJcbiAgICBleHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJDb21wb25lbnQoXHJcbiAgICAgICAgcmVnOiBJQ29tcG9uZW50UmVnaXN0cmF0aW9uLFxyXG4gICAgICAgIG1vZHVsZTogbmcuSU1vZHVsZVxyXG4gICAgKSB7XHJcbiAgICAgICAgLy9Qcm92aWRlIGRlZmF1bHQgZm9yIHRlbXBsYXRlVXJsUm9vdCwgaWYgbm90IHNwZWNpZmllZCwgYW5kIGVuc3VyZSBpdCBzdGFydHMgYW5kIGVuZHMgd2l0aCBhICcvJy5cclxuICAgICAgICBsZXQgdGVtcGxhdGVVcmxSb290OiBzdHJpbmcgPSByZWcudGVtcGxhdGVVcmxSb290IHx8IGAvY2xpZW50L21vZHVsZXMvJHttb2R1bGUubmFtZX0vYDtcclxuICAgICAgICBpZiAoIV8uc3RhcnRzV2l0aCh0ZW1wbGF0ZVVybFJvb3QsICcvJykpIHtcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmxSb290ID0gJy8nICsgdGVtcGxhdGVVcmxSb290O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIV8uZW5kc1dpdGgodGVtcGxhdGVVcmxSb290LCAnLycpKSB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsUm9vdCArPSAnLyc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vVE9ETzogVGVtcGxhdGUgVVJMIHJvb3Qgc2hvdWxkIHN0YXJ0IGFuZCBlbmQgd2l0aCAnLydcclxuXHJcbiAgICAgICAgLy9Qcm92aWRlIGRlZmF1bHQgZm9yIHRlbXBsYXRlVXJsLCBpZiBub3Qgc3BlY2lmaWVkLCBhbmQgZW5zdXJlIHRoYXQgaXQgZG9lcyBub3Qgc3RhcnQgd2l0aCBhICcvJy5cclxuICAgICAgICBsZXQgdGVtcGxhdGVVcmw6IHN0cmluZyA9IHJlZy50ZW1wbGF0ZVVybCB8fCBgJHtyZWcubmFtZX0vJHtyZWcubmFtZX0uaHRtbGA7XHJcbiAgICAgICAgaWYgKF8uc3RhcnRzV2l0aCh0ZW1wbGF0ZVVybCwgJy8nKSkge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA9IHRlbXBsYXRlVXJsLnN1YnN0cigxKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vUmVhZCB0aGUgYmluZGluZ3MgZGVjbGFyZWQgdXNpbmcgdGhlIEBiaW5kIGRlY29yYXRvcnMgYW5kIGFkZCB0aGVtIHRvIGFuIG9iamVjdC5cclxuICAgICAgICBsZXQgYmluZGluZ3M6IHsgW2JpbmRpbmc6IHN0cmluZ106IHN0cmluZyB9ID0gcmVnLmNvbnRyb2xsZXJbJ2JpbmRpbmdzJ10gPyB7fSA6IHVuZGVmaW5lZDtcclxuICAgICAgICBpZiAoYmluZGluZ3MpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgYiBpbiByZWcuY29udHJvbGxlclsnYmluZGluZ3MnXSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlZy5jb250cm9sbGVyWydiaW5kaW5ncyddLmhhc093blByb3BlcnR5KGIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZ3NbYl0gPSByZWcuY29udHJvbGxlclsnYmluZGluZ3MnXVtiXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbW9kdWxlLmNvbXBvbmVudChfLmNhbWVsQ2FzZShyZWcubmFtZSksIHtcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGAke3RlbXBsYXRlVXJsUm9vdH0ke3RlbXBsYXRlVXJsfWAsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IHJlZy5jb250cm9sbGVyIGFzIG5nLkluamVjdGFibGU8bmcuSUNvbnRyb2xsZXJDb25zdHJ1Y3Rvcj4sXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogXy5jYW1lbENhc2UocmVnLm5hbWUpLFxyXG4gICAgICAgICAgICBiaW5kaW5nczogYmluZGluZ3NcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKHJlZy5yb3V0ZSkge1xyXG4gICAgICAgICAgICBsZXQgcm91dGU6IElDb21wb25lbnRSb3V0ZSA9IHJlZy5yb3V0ZTtcclxuXHJcbiAgICAgICAgICAgIC8vUmVhZCB0aGUgcmVzb2x2ZXMgZGVjbGFyZWQgdXNpbmcgdGhlIEByZXNvbHZlZCBhbmQgQHJlc29sdmVyIGRlY29yYXRvcnMgYW5kIGFkZCB0aGVtXHJcbiAgICAgICAgICAgIC8vdG8gYW55IGV4aXN0aW5nIHJlc29sdmVzIGRlY2xhcmVkIGFzIHBhcnQgb2YgdGhlIEBQYWdlIGRlY2xhcmF0aW9uLlxyXG4gICAgICAgICAgICBsZXQgcmVzb2x2ZXM6IHtba2V5OiBzdHJpbmddOiBGdW5jdGlvbn0gPSByb3V0ZS5yZXNvbHZlIHx8IHt9O1xyXG4gICAgICAgICAgICBsZXQgZGVjbGFyZWRSZXNvbHZlczoge1trZXk6IHN0cmluZ106IEZ1bmN0aW9ufSA9IHJlZy5jb250cm9sbGVyWydyZXNvbHZlcyddID8ge30gOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIGlmIChkZWNsYXJlZFJlc29sdmVzKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCByIGluIHJlZy5jb250cm9sbGVyWydyZXNvbHZlcyddKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlZy5jb250cm9sbGVyWydyZXNvbHZlcyddLmhhc093blByb3BlcnR5KHIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmVzW3JdID0gcmVnLmNvbnRyb2xsZXJbJ3Jlc29sdmVzJ11bcl07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL0Zyb20gdGhlIGZ1bGwgc2V0IG9mIHJlc29sdmVzLCBidWlsZCB0aGUgYXR0cmlidXRlIHN0cmluZyB0byBhZGQgdG8gdGhlIHRlbXBsYXRlIHN0cmluZy5cclxuICAgICAgICAgICAgbGV0IHJlc29sdmVBdHRyczogc3RyaW5nW10gPSBbXTtcclxuICAgICAgICAgICAgaWYgKHJlc29sdmVzKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCByZXNvbHZlS2V5IGluIHJlc29sdmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc29sdmVzLmhhc093blByb3BlcnR5KHJlc29sdmVLZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmVBdHRycy5wdXNoKGAke18ua2ViYWJDYXNlKHJlc29sdmVLZXkpfT1cIiRyZXNvbHZlLiR7cmVzb2x2ZUtleX1cImApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgdGVtcGxhdGU6IHN0cmluZyA9IHJlc29sdmVBdHRycy5sZW5ndGggPT09IDAgP1xyXG4gICAgICAgICAgICAgICAgYDwke3JlZy5uYW1lfT48LyR7cmVnLm5hbWV9PmAgOlxyXG4gICAgICAgICAgICAgICAgYDwke3JlZy5uYW1lfSAke3Jlc29sdmVBdHRycy5qb2luKCcgJyl9PjwvJHtyZWcubmFtZX0+YDtcclxuXHJcbiAgICAgICAgICAgIG1vZHVsZS5jb25maWcoWyckc3RhdGVQcm92aWRlcicsXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXI6IG5nLnVpLklTdGF0ZVByb3ZpZGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9FbnN1cmUgcm91dGUgcGF0aCBzcGVjaWZpZWQgYW5kIHN0YXJ0cyB3aXRoIGEgJy8nXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJvdXRlUGF0aDogc3RyaW5nID0gcm91dGUucGF0aDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXJvdXRlUGF0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFNwZWNpZnkgYSByb3V0ZSBwYXRoIGZvciB0aGUgcGFnZSAke3JlZy5uYW1lfS5gKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvdXRlUGF0aCAhPT0gJ14nICYmICFfLnN0YXJ0c1dpdGgocm91dGVQYXRoLCAnLycpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlUGF0aCA9ICcvJyArIHJvdXRlUGF0aDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vVE9ETzogVXNlIGNvbXBvbmVudCBmaWVsZCBpbnN0ZWFkIG9mIHRlbXBsYXRlLiBDb25zdWx0IFN1bm55IGFuZCBzZWUgaWYgY29tcG9uZW50IGlzIGF2YWlsYWJsZSBpbiBjdXJyZW50IHZlcnNpb24gb2YgdWktcm91dGVyLlxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzdGF0ZTogbmcudWkuSVN0YXRlID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiByZWcubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6IHRlbXBsYXRlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHJvdXRlUGF0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZTogcmVzb2x2ZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtczogcm91dGUucGFyYW1zXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocm91dGUuYWJzdHJhY3QgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5hYnN0cmFjdCA9IHJvdXRlLmFic3RyYWN0O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAocm91dGUucGFyZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwYXJlbnQ6IHN0cmluZyB8IElDb21wb25lbnRSZWdpc3RyYXRpb24gPSByb3V0ZS5wYXJlbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcGFyZW50ID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUucGFyZW50ID0gcGFyZW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUucGFyZW50ID0gcGFyZW50Lm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoc3RhdGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyTGF5b3V0KFxyXG4gICAgICAgIHJlZzogSUxheW91dFJlZ2lzdHJhdGlvbixcclxuICAgICAgICBtb2R1bGU6IG5nLklNb2R1bGVcclxuICAgICkge1xyXG4gICAgICAgIGxldCBtYXRjaGVzOiBSZWdFeHBNYXRjaEFycmF5ID0gcmVnLm5hbWUubWF0Y2goL14oXFx3KyktbGF5b3V0JC8pO1xyXG4gICAgICAgIGxldCBsYXlvdXROYW1lOiBzdHJpbmcgPSBtYXRjaGVzID8gbWF0Y2hlc1sxXSA6IHJlZy5uYW1lO1xyXG4gICAgICAgIGxldCB0ZW1wbGF0ZVVybDogc3RyaW5nID0gcmVnLnRlbXBsYXRlVXJsIHx8IGBsYXlvdXRzLyR7bGF5b3V0TmFtZX0vJHtsYXlvdXROYW1lfS5odG1sYDtcclxuICAgICAgICByZWdpc3RlckNvbXBvbmVudCh7XHJcbiAgICAgICAgICAgIG5hbWU6IHJlZy5uYW1lLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiByZWcuY29udHJvbGxlcixcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IHRlbXBsYXRlVXJsLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybFJvb3Q6IHJlZy50ZW1wbGF0ZVVybFJvb3QsXHJcbiAgICAgICAgICAgIHJvdXRlOiB7XHJcbiAgICAgICAgICAgICAgICBhYnN0cmFjdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHBhdGg6ICdeJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgbW9kdWxlKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJTZXJ2aWNlKHJlZzogSVNlcnZpY2VSZWdpc3RyYXRpb24pIHtcclxuICAgICAgICByZWcubW9kdWxlLnNlcnZpY2UoXy5jYW1lbENhc2UocmVnLm5hbWUpLCByZWcuc2VydmljZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyU3RhdGUocmVnOiBJU3RhdGVSZWdpc3RyYXRpb24pIHtcclxuICAgICAgICByZWcubW9kdWxlLnNlcnZpY2UoXy5jYW1lbENhc2UocmVnLm5hbWUpLCByZWcuc3RhdGUpO1xyXG4gICAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBuZzFUZW1wbGF0ZS5jb3JlIHtcclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSUNvbXBvbmVudFJlZ2lzdHJhdGlvbiB7XHJcbiAgICAgICAgbmFtZTogc3RyaW5nO1xyXG4gICAgICAgIGNvbnRyb2xsZXI6IEZ1bmN0aW9uIHwgbmcuSW5qZWN0YWJsZTxuZy5JQ29udHJvbGxlckNvbnN0cnVjdG9yPjtcclxuICAgICAgICB0ZW1wbGF0ZVVybDogc3RyaW5nO1xyXG4gICAgICAgIHRlbXBsYXRlVXJsUm9vdD86IHN0cmluZztcclxuICAgICAgICBiaW5kaW5ncz86IHsgW2JpbmRpbmc6IHN0cmluZ106IHN0cmluZyB9O1xyXG4gICAgICAgIHJvdXRlPzogSUNvbXBvbmVudFJvdXRlO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSUNvbXBvbmVudFJvdXRlIHtcclxuICAgICAgICBwYXRoOiBzdHJpbmc7XHJcbiAgICAgICAgcmVzb2x2ZT86IHsgW2tleTogc3RyaW5nXTogRnVuY3Rpb24gfTtcclxuICAgICAgICBwYXJhbXM/OiB7IFtuYW1lOiBzdHJpbmddOiBzdHJpbmcgfCBJUm91dGVQYXJhbXNWYWx1ZSB9O1xyXG4gICAgICAgIGFic3RyYWN0PzogYm9vbGVhbjtcclxuICAgICAgICBwYXJlbnQ/OiBzdHJpbmcgfCBJQ29tcG9uZW50UmVnaXN0cmF0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSVJvdXRlUGFyYW1zVmFsdWUge1xyXG4gICAgICAgIHZhbHVlPzogYW55O1xyXG4gICAgICAgIGFycmF5PzogYm9vbGVhbjtcclxuICAgICAgICBzcXVhc2g/OiBib29sZWFuIHwgc3RyaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSUxheW91dFJlZ2lzdHJhdGlvbiB7XHJcbiAgICAgICAgbmFtZTogc3RyaW5nO1xyXG4gICAgICAgIGNvbnRyb2xsZXI6IEZ1bmN0aW9uIHwgbmcuSW5qZWN0YWJsZTxuZy5JQ29udHJvbGxlckNvbnN0cnVjdG9yPjtcclxuICAgICAgICB0ZW1wbGF0ZVVybDogc3RyaW5nO1xyXG4gICAgICAgIHRlbXBsYXRlVXJsUm9vdD86IHN0cmluZztcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElTZXJ2aWNlUmVnaXN0cmF0aW9uIHtcclxuICAgICAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICAgICAgc2VydmljZTogRnVuY3Rpb247XHJcbiAgICAgICAgbW9kdWxlOiBuZy5JTW9kdWxlO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSVN0YXRlUmVnaXN0cmF0aW9uIHtcclxuICAgICAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICAgICAgc3RhdGU6IEZ1bmN0aW9uO1xyXG4gICAgICAgIG1vZHVsZTogbmcuSU1vZHVsZTtcclxuICAgIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgbmcxVGVtcGxhdGUuY29yZSB7XHJcbiAgICAvKipcclxuICAgICAqIEFuZ3VsYXIgc2VydmljZSB0aGF0IGV4cG9zZXMgdGhlIEhUTUw1IGxvY2FsIHN0b3JhZ2UgYW5kIHNlc3Npb24gc3RvcmFnZSBjYXBhYmlsaXRpZXMuXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBTdG9yYWdlU2VydmljZSB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyAkaW5qZWN0ID0gWyckd2luZG93J107XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgJHdpbmRvdzogbmcuSVdpbmRvd1NlcnZpY2UpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBTdG9yYWdlID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGlzIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBsb2NhbCBvciBzZXNzaW9uIHN0b3JhZ2UuYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBnZXRMb2NhbChrZXk6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhbmd1bGFyLmZyb21Kc29uKHRoaXMuJHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBnZXRTZXNzaW9uKGtleTogc3RyaW5nKTogYW55IHtcclxuICAgICAgICAgICAgcmV0dXJuIGFuZ3VsYXIuZnJvbUpzb24odGhpcy4kd2luZG93LnNlc3Npb25TdG9yYWdlLmdldEl0ZW0oa2V5KSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgcmVtb3ZlTG9jYWwoa2V5OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy4kd2luZG93LmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGtleSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgcmVtb3ZlU2Vzc2lvbihrZXk6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLiR3aW5kb3cuc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHNldExvY2FsKGtleTogc3RyaW5nLCB2YWx1ZTogYW55KTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuJHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIGFuZ3VsYXIudG9Kc29uKHZhbHVlKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc2V0U2Vzc2lvbihrZXk6IHN0cmluZywgdmFsdWU6IGFueSk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLiR3aW5kb3cuc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShrZXksIGFuZ3VsYXIudG9Kc29uKHZhbHVlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvcmVNb2R1bGUuc2VydmljZSgnc3RvcmFnZVNlcnZpY2UnLCBTdG9yYWdlU2VydmljZSk7XHJcbn1cclxuIl19