

declare namespace bind {
    function oneWay(): (target: Object, key: string) => void;
    function twoWay(): (target: Object, key: string) => void;
    function string(): (target: Object, key: string) => void;
    function event(): (target: Object, key: string) => void;
}
declare namespace ng1Template.core {
    type ClassDecorator = (target: Function) => void;
    type ClassDecoratorFactory = () => ClassDecorator;
}
declare function Component(details: {
    selector: string;
    templateUrl: string;
    templateUrlRoot?: string;
}, module: ng.IModule, route?: ng1Template.core.IComponentRoute): (target: Function) => void;
declare function Layout(details: {
    name: string;
    templateUrl: string;
    templateUrlRoot?: string;
}, module: ng.IModule): (target: Function) => void;
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
            [key: string]: any;
        };
        abstract?: boolean;
        parent?: string | IComponentRegistration;
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
        name?: string;
        service: Function;
        module: ng.IModule;
    }
    function registerService(reg: IServiceRegistration): void;
}
declare namespace ng1Template.core {
    const coreModule: ng.IModule;
}
