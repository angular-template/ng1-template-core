

declare namespace ng1Template.core {
    const coreModule: ng.IModule;
}
declare namespace ng1Template.core {
    /**
     * Angular service that exposes the HTML5 local storage and session storage capabilities.
     */
    class StorageService {
        private $window;
        constructor($window: ng.IWindowService);
        getLocal(key: string): any;
        getSession(key: string): any;
        removeLocal(key: string): void;
        removeSession(key: string): void;
        setLocal(key: string, value: any): void;
        setSession(key: string, value: any): void;
    }
}
declare namespace bind {
    function oneWay(): (target: Object, key: string) => void;
    function twoWay(): (target: Object, key: string) => void;
    function string(): (target: Object, key: string) => void;
    function event(): (target: Object, key: string) => void;
}
declare namespace ng1Template.core {
    /**
     * Represents a decorator function for a class.
     * @param target The constructor function of the class.
     */
    type ClassDecorator = (target: Function) => void;
    /**
     * Details required by the component decorator to register a component.
     */
    interface IComponentDetails {
        selector: string;
        templateUrl?: string;
        templateUrlRoot?: string;
    }
    type ComponentDecoratorFactory = (details: IComponentDetails, route?: IComponentRoute) => ClassDecorator;
    interface ILayoutDetails {
        name: string;
        templateUrl?: string;
        templateUrlRoot?: string;
    }
    type LayoutDecoratorFactory = (details: ILayoutDetails) => ClassDecorator;
    type ServiceDecoratorFactory = (name: string) => ClassDecorator;
}
declare namespace ng1Template.core {
    interface IComponentRegistration {
        name: string;
        controller: ng.IComponentController;
        templateUrl: string;
        templateUrlRoot?: string;
        bindings?: {
            [binding: string]: string;
        };
        route?: IComponentRoute;
    }
    interface IComponentRoute {
        path: string;
        resolve?: {
            [key: string]: Function;
        };
        params?: {
            [name: string]: string | IRouteParamsValue;
        };
        abstract?: boolean;
        parent?: string | IComponentRegistration;
    }
    interface IRouteParamsValue {
        value?: any;
        array?: boolean;
        squash?: boolean | string;
    }
    function registerComponent(reg: IComponentRegistration, module: ng.IModule): void;
    interface ILayoutRegistration {
        name: string;
        controller: ng.IComponentController;
        templateUrl: string;
        templateUrlRoot?: string;
    }
    function registerLayout(reg: ILayoutRegistration, module: ng.IModule): void;
    interface IServiceRegistration {
        name: string;
        service: Function;
        module: ng.IModule;
    }
    function registerService(reg: IServiceRegistration): void;
    interface IStateRegistration {
        name: string;
        state: Function;
        module: ng.IModule;
    }
    function registerState(reg: IStateRegistration): void;
}
declare function resolved(target: Object, key: string): void;
declare function resolver(params?: string[]): (target: Object, key: string, descriptor: PropertyDescriptor) => void;
declare namespace route {
    type RouteDataTypes = 'string' | 'int' | 'float' | 'boolean';
    function query(dataType: RouteDataTypes, name: string): (target: Object, key: string) => void;
    function param(dataType: RouteDataTypes, name: string): (target: Object, key: string) => void;
    type RouteProperties = {
        [key: string]: RouteDataTypes;
    };
    function multiple(parameters: RouteProperties): (target: Object, key: string) => void;
}
declare namespace state {
    function inMemory(): (target: Object, key: string) => void;
    function session(): (target: Object, key: string) => void;
    function persisted(): (target: Object, key: string) => void;
}
