/// <reference path="typings/index.d.ts" />
/// <reference path="typings/package.d.ts" />
declare namespace bind {
    function oneWay(): (target: Object, key: string) => void;
    function twoWay(): (target: Object, key: string) => void;
    function string(): (target: Object, key: string) => void;
    function event(): (target: Object, key: string) => void;
}
declare function Component(details: {
    selector: string;
    templateUrl?: string;
    templateUrlRoot?: string;
    route?: ng1Template.core.IComponentRoute;
}, module: ng.IModule): (target: Function) => void;
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
}
declare namespace ng1Template.core {
    const coreModule: ng.IModule;
}
