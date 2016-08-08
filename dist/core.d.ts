

declare namespace ng1Template.core {
    const coreModule: ng.IModule;
}
declare namespace ng1Template.core {
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
    type ClassDecorator = (target: Function) => void;
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
            [key: string]: any;
        };
        params?: any;
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
        name: string;
        service: Function;
        module: ng.IModule;
    }
    function registerService(reg: IServiceRegistration): void;
}
declare namespace ng1Template.core {
    abstract class BaseState {
        private _storage;
        constructor(storage: IStorageDescriptor[]);
        protected initialize(): void;
        clear(initialize?: boolean): void;
        reset(): void;
        protected setState<T>(name: string, value: T): void;
        protected getState<T>(name: string): T;
    }
    interface IStorageDescriptor {
        name: string;
        type: StateType;
    }
    enum StateType {
        inMemory = 0,
        session = 1,
        persisted = 2,
    }
}
