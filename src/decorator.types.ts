namespace ng1Template.core {
    /**
     * Represents a decorator function for a class.
     * @param target The constructor function of the class.
     */
    export type ClassDecorator = (target: Function) => void;

    /**
     * Details required by the component decorator to register a component.
     */
    export interface IComponentDetails {
        selector: string;
        templateUrl?: string;
        templateUrlRoot?: string;
    }

    export type ComponentDecoratorFactory = (details: IComponentDetails) => ClassDecorator;
    export type PageDecoratorFactory = (details: IComponentDetails, route: IComponentRoute) => ClassDecorator;

    export interface ILayoutDetails {
        name: string;
        templateUrl?: string;
        templateUrlRoot?: string;
    }

    export type LayoutDecoratorFactory = (details: ILayoutDetails) => ClassDecorator;

    export type ServiceDecoratorFactory = (name: string) => ClassDecorator;
}
