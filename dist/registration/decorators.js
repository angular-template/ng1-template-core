/// <reference path="../../typings/index.d.ts"/>
/// <reference path="../../typings/package.d.ts"/>
function Component(details, module) {
    return function (target) {
        var bindings = target['bindings'] ? {} : undefined;
        if (bindings) {
            for (var b in target['bindings']) {
                if (target['bindings'].hasOwnProperty(b)) {
                    bindings[b] = target['bindings'][b];
                }
            }
        }
        ng1Template.core.registerComponent({
            name: details.selector,
            controller: target,
            templateUrl: details.templateUrl,
            templateUrlRoot: details.templateUrlRoot,
            bindings: bindings,
            route: details.route
        }, module);
    };
}
function Layout(details, module) {
    return function (target) {
        ng1Template.core.registerLayout({
            name: details.name,
            controller: target,
            templateUrl: details.templateUrl,
            templateUrlRoot: details.templateUrlRoot
        }, module);
    };
}
