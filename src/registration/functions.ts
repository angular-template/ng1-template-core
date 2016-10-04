/// <reference path="../../typings/index.d.ts"/>
/// <reference path="../../typings/package.d.ts"/>

namespace ng1Template.core {
    export interface IComponentRegistration {
        name: string;
        controller: ng.IComponentController;
        templateUrl: string;
        templateUrlRoot?: string;
        bindings?: { [binding: string]: string };
        route?: IComponentRoute;
    }

    export interface IComponentRoute {
        path: string;
        resolve?: { [key: string]: Function };
        params?: { [name: string]: string | IRouteParamsValue };
        abstract?: boolean;
        parent?: string | IComponentRegistration;
    }

    export interface IRouteParamsValue {
        value?: any;
        array?: boolean;
        squash?: boolean | string;
    }

    export function registerComponent(
        reg: IComponentRegistration,
        module: ng.IModule
    ) {
        let templateUrlRoot: string = reg.templateUrlRoot || `/client/modules/${module.name}/`;
        let templateUrl: string = reg.templateUrl || `${reg.name}/${reg.name}.html`;

        let bindings: { [binding: string]: string } = reg.controller['bindings'] ? {} : undefined;
        if (bindings) {
            for (let b in reg.controller['bindings']) {
                if (reg.controller['bindings'].hasOwnProperty(b)) {
                    bindings[b] = reg.controller['bindings'][b];
                }
            }
        }

        module.component(_.camelCase(reg.name), {
            templateUrl: `${templateUrlRoot}${templateUrl}`,
            controller: reg.controller,
            controllerAs: _.camelCase(reg.name),
            bindings: bindings
        });

        if (reg.route) {
            let route: IComponentRoute = reg.route;

            let resolves: {[key: string]: Function} = route.resolve || {};
            let declaredResolves: {[key: string]: Function} = reg.controller['resolves'] ? {} : undefined;
            if (declaredResolves) {
                for (let r in reg.controller['resolves']) {
                    if (reg.controller['resolves'].hasOwnProperty(r)) {
                        resolves[r] = reg.controller['resolves'][r];
                    }
                }
            }

            let resolveAttrs: string[] = [];
            if (resolves) {
                for (let resolveKey in resolves) {
                    if (resolves.hasOwnProperty(resolveKey)) {
                        resolveAttrs.push(`${_.kebabCase(resolveKey)}="$resolve.${resolveKey}"`);
                    }
                }
            }
            let template: string = resolveAttrs.length === 0 ?
                `<${reg.name}></${reg.name}>` :
                `<${reg.name} ${resolveAttrs.join(' ')}></${reg.name}>`;

            module.config(['$stateProvider',
                function ($stateProvider: ng.ui.IStateProvider) {
                    //TODO: Use component field instead of template. Consult Sunny and see if component is available in current version of ui-router.
                    let state: ng.ui.IState = {
                        name: reg.name,
                        template: template,
                        url: route.path,
                        resolve: resolves,
                        params: route.params
                    };
                    if (route.abstract !== undefined) {
                        state.abstract = route.abstract;
                    }
                    if (route.parent) {
                        let parent: string | IComponentRegistration = route.parent;
                        if (typeof parent === 'string') {
                            state.parent = parent;
                        } else {
                            state.parent = parent.name;
                        }
                    }
                    $stateProvider.state(state);
                }
            ]);
        }
    }

    export interface ILayoutRegistration {
        name: string;
        controller: ng.IComponentController;
        templateUrl: string;
        templateUrlRoot?: string;
    }

    export function registerLayout(
        reg: ILayoutRegistration,
        module: ng.IModule
    ) {
        let matches: RegExpMatchArray = reg.name.match(/^(\w+)-layout$/);
        let layoutName: string = matches ? matches[1] : reg.name;
        let templateUrl: string = reg.templateUrl || `layouts/${layoutName}/${layoutName}.html`;
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

    export interface IServiceRegistration {
        name: string;
        service: Function;
        module: ng.IModule;
    }

    export function registerService(reg: IServiceRegistration) {
        reg.module.service(_.camelCase(reg.name), reg.service);
    }

    export interface IStateRegistration {
        name: string;
        state: Function;
        module: ng.IModule;
    }

    export function registerState(reg: IStateRegistration) {
        reg.module.service(_.camelCase(reg.name), reg.state);
    }
}
