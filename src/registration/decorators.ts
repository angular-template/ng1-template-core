/// <reference path="../../typings/index.d.ts"/>
/// <reference path="../../typings/package.d.ts"/>

function Component(details: {
    selector: string,
    templateUrl?: string,
    templateUrlRoot?: string
}, module: ng.IModule, route?: ng1Template.core.IComponentRoute) {
    return function(target: Function) {
        let bindings: { [binding: string]: string } = target['bindings'] ? {} : undefined;
        if (bindings) {
            for (let b in target['bindings']) {
                if (target['bindings'].hasOwnProperty(b)) {
                    bindings[b] = target['bindings'][b];
                }
            }
        }
        ng1Template.core.registerComponent({
            name: details.selector,
            controller: target,
            templateUrl: details.templateUrl || `${details.selector}/${details.selector}.html`,
            templateUrlRoot: details.templateUrlRoot,
            bindings: bindings,
            route: route
        }, module);
    }
}

function Layout(details: {
    name: string,
    templateUrl?: string,
    templateUrlRoot?: string
}, module: ng.IModule) {
    return function(target: Function) {
        ng1Template.core.registerLayout({
            name: details.name,
            controller: target,
            templateUrl: details.templateUrl || `layouts/${details.name}/${details.name}.html`,
            templateUrlRoot: details.templateUrlRoot
        }, module);
    }
}
