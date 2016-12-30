namespace ng1Template.core {
    export interface IComponentRegistration {
        name: string;
        controller: Function | ng.Injectable<ng.IControllerConstructor>;
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
        //Provide default for templateUrlRoot, if not specified, and ensure it starts and ends with a '/'.
        let templateUrlRoot: string = reg.templateUrlRoot || `/client/modules/${module.name}/`;
        if (!_.startsWith(templateUrlRoot, '/')) {
            templateUrlRoot = '/' + templateUrlRoot;
        }
        if (!_.endsWith(templateUrlRoot, '/')) {
            templateUrlRoot += '/';
        }
        //TODO: Template URL root should start and end with '/'

        //Provide default for templateUrl, if not specified, and ensure that it does not start with a '/'.
        let templateUrl: string = reg.templateUrl || `${reg.name}/${reg.name}.html`;
        if (_.startsWith(templateUrl, '/')) {
            templateUrl = templateUrl.substr(1);
        }

        //Read the bindings declared using the @bind decorators and add them to an object.
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
            controller: reg.controller as ng.Injectable<ng.IControllerConstructor>,
            controllerAs: _.camelCase(reg.name),
            bindings: bindings
        });

        if (reg.route) {
            let route: IComponentRoute = reg.route;

            //Read the resolves declared using the @resolved and @resolver decorators and add them
            //to any existing resolves declared as part of the @Page declaration.
            let resolves: {[key: string]: Function} = route.resolve || {};
            let declaredResolves: {[key: string]: Function} = reg.controller['resolves'] ? {} : undefined;
            if (declaredResolves) {
                for (let r in reg.controller['resolves']) {
                    if (reg.controller['resolves'].hasOwnProperty(r)) {
                        resolves[r] = reg.controller['resolves'][r];
                    }
                }
            }

            //From the full set of resolves, build the attribute string to add to the template string.
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
                    //Ensure route path specified and starts with a '/'
                    let routePath: string = route.path;
                    if (!routePath) {
                        throw new Error(`Specify a route path for the page ${reg.name}.`);
                    }
                    if (routePath !== '^' && !_.startsWith(routePath, '/')) {
                        routePath = '/' + routePath;
                    }

                    //TODO: Use component field instead of template. Consult Sunny and see if component is available in current version of ui-router.
                    let state: ng.ui.IState = {
                        name: reg.name,
                        template: template,
                        url: routePath,
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
        controller: Function | ng.Injectable<ng.IControllerConstructor>;
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
