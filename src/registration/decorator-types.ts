/// <reference path="../../typings/index.d.ts"/>
/// <reference path="../../typings/package.d.ts"/>

namespace ng1Template.core {
    export type ClassDecorator = (target: Function) => void;
    export type ClassDecoratorFactory = () => ClassDecorator;
}
