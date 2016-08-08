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
        resolve?: { [key: string]: any };
        params?: any;
        abstract?: boolean;
        parent?: string | IComponentRegistration;
    }

    export function registerComponent(
        reg: IComponentRegistration,
        module: ng.IModule
    ) {
        let templateUrlRoot: string = reg.templateUrlRoot || `/client/modules/${module.name}/`;
        let templateUrl: string = reg.templateUrl || `${reg.name}/${reg.name}.html`

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
            module.config(['$stateProvider',
                function ($stateProvider: ng.ui.IStateProvider) {
                    //TODO: Use component field instead of template. Consult Sunny and see if component is available in current version of ui-router.
                    let state: ng.ui.IState = {
                        name: reg.name,
                        template: `<${reg.name}></${reg.name}>`,
                        url: route.path,
                        resolve: route.resolve,
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

    export interface IServiceRegistration {
        name: string;
        service: Function;
        module: ng.IModule;
    }

    export function registerService(reg: IServiceRegistration) {
        reg.module.service(_.camelCase(reg.name), reg.service);
    }
}
