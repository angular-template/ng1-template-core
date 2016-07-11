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
        abstract?: boolean;
        parent?: string | IComponentRegistration;
    }

    export function registerComponent(
        reg: IComponentRegistration,
        module: ng.IModule
    ) {
        let finalTemplateUrlRoot: string = reg.templateUrlRoot || `/client/modules/${module.name}/`;
        module.component(_.camelCase(reg.name), {
            templateUrl: `${finalTemplateUrlRoot}${reg.templateUrl}`,
            controller: reg.controller,
            controllerAs: _.camelCase(reg.name),
            bindings: reg.bindings
        });

        if (reg.route) {
            let route: IComponentRoute = reg.route;
            module.config(['$stateProvider',
                function ($stateProvider: ng.ui.IStateProvider) {
                    let state: ng.ui.IState = {
                        name: reg.name,
                        template: `<${reg.name}></${reg.name}>`,
                        url: route.path,
                        resolve: route.resolve,
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
}