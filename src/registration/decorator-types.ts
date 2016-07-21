/// <reference path="../../typings/index.d.ts"/>
/// <reference path="../../typings/package.d.ts"/>

namespace ng1Template.core {
    export type ClassDecorator = (target: Function) => void;

    export interface IComponentDetails {
        selector: string;
        templateUrl?: string;
        templateUrlRoot?: string;
    }

    export type ComponentDecoratorFactory = (details: IComponentDetails, route?: IComponentRoute) => ClassDecorator;

    export interface ILayoutDetails {
        name: string;
        templateUrl?: string;
        templateUrlRoot?: string;
    }

    export type LayoutDecoratorFactory = (details: ILayoutDetails) => ClassDecorator;

    export type InjectorDecoratorFactory = () => ClassDecorator;
}
