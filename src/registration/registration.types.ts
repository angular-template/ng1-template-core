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

    export interface ILayoutRegistration {
        name: string;
        controller: Function | ng.Injectable<ng.IControllerConstructor>;
        templateUrl: string;
        templateUrlRoot?: string;
    }

    export interface IServiceRegistration {
        name: string;
        service: Function;
        module: ng.IModule;
    }

    export interface IStateRegistration {
        name: string;
        state: Function;
        module: ng.IModule;
    }
}
