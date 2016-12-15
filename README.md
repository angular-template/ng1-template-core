# Angular 1.x Template Core Package
Core package for the Angular 1.5 template, with essential decorators, services and types.

## Page-specific decorators
These decorators can be applied to page components (components with routes).

### Resolve decorators
Resolve decorators simplify the work needed to write [resolve logic](https://github.com/angular-ui/ui-router/wiki#user-content-resolve) that is executed during route navigation.

For every resolve, there are two decorators that need to be applied:
* __@resolved__: Applied on the property that will store the result of the resolve logic.
* __@resolver__: Applied on the method that will execute the resolve logic.
    * The method name must follow the convention of `resolve<pascal-case property name>`. For example, if the property is `data`, then the method must be called `resolveData`.
    * The decorator accepts a string array parameter, which is the names of the services passed as parameters to the method.
    * The method can return the value directly or a promise.

```typescript
export class MyPage {
    @resolved
    public customers: Customer[];

    @resolver(['customerWebService'])
    public resolveCustomers(customerWebService: CustomerWebService): ng.IPromise<Customer[]> {
        return customerWebService.getCustomers();
    }

    /*
       Resolves can depend on each other, will execute sequently in such cases.
       Below is a resolve block for the customer count, which is dependent on the
       customer data first being retrieved in the above resolve block.
    */
    @resolved
    public customerCount: number;

    @resolver(['customers', '$log'])
    public resolveCustomerCount(
        customers: Customer[],
        $log: ng.ILogService
    ): number {
        $log.log(`Number of customers retrieved: ${customers.length}`);
        return customers.length;
    }
}
```

> Note: Although the resolver methods are written like instance methods, they are actually executed in a different context and hence should not access any other instance members of the class.

### Route parameter decorators
Route parameter decorators simply the retrieval of parameters and query strings values from the route URL.

```typescript
@Page({selector: 'my-page'}, {
    path: '/my-page/id/order?query&page-title&page-size&summary',
    parent: 'main-layout'
})
export class MyPage {
    // Reads a path parameter 'id' as a string
    @route.param()
    public id: string;

    // Reads a query string parameter 'query' as a string
    @route.query()
    public query: string

    // Unless otherwise specified, kebab-cased and snake-cased parameters are
    // translated to camel-cased properties
    // Reads a query string parameter 'page-title' as a string
    @route.query()
    public pageTitle: string;

    // You can specify non-string types - int, float and boolean.
    // Reads a query string parameter 'page-size' as an integer.
    @route.query({type: 'int'})
    public pageSize: number;

    // Boolean types accept any of the following values:
    // For true values - 1, yes, y, true
    // For false values - 0, no, n, false
    // Reads a query string parameter 'summary' as a boolean
    @route.query({type: 'boolean'})
    public summary: boolean;

    // You can also specify a different property name from the one declared on
    // the route.
    // Reads a path parameter 'order' as an integer
    @route.param({name: 'order', type: 'int'})
    public orderNumber: number;
}
```

There is a also a special route decorator `@route.multiple` that allows you to combine multiple route parameter definitions into a single structure.

For example, the above code can also be written as follows:

```typescript
@Page({selector: 'my-page'}, {
    path: '/my-page/id/order?query&page-title&page-size&summary',
    parent: 'main-layout'
})
export class MyPage {
    // Specify an object literal where the key is the name of the parameter (as
    // it appears in the URL) and the value is a string that represents the
    // data type.
    // Keys that represent path parameters are prefixed with a colon (:)
    // Keys that represent query string parameters are prefixed with a question mark (?)

    @route.multiple({
        '?query': 'string',
        '?page-size': 'int'
    })
    public query: {
        query: string;
        pageSize: number;
    };

    @route.multiple({
        ':id': 'string',
        ':order': 'int',
        '?page-title': 'string',
        '?summary': 'boolean'
    })
    public other: IOtherParams;
}

interface IQueryParams {
    query: string;
    pageSize: number;
}

interface IOtherParams {
    id: string;
    order: number;
    pageTitle: string;
    summary: boolean;
}
```

> __Note__: Currently `@route.multiple` does not allow you to customize the name of property.
We're working on this.

## Component-specific decorators
These decorators can be applied in non-routing components.

### Binding decorators
Binding decorators provide an easy way to declare [component bindings](https://docs.angularjs.org/guide/component).

```typescript
@Component({selector: 'my-component'})
export class MyComponent {
    // One way bindings (<)
    @bind.oneWay()
    public data1: string;

    // Two way bindings (=)
    @bind.twoWay()
    public data2: number;

    // Bind to string value (@)
    @bind.string()
    public data3: string;

    // Bind to callback function (&)
    @bind.event()
    public onEvent: () => void;
}
```

You can use the component like so:
```html
<my-component
    data1="vm.data1"
    data2="vm.data2"
    data3="Just a string"
    on-event="vm.handleTheEvent()">
</my-component>
```

## State decorators
State decorators simplify writing of Angular services that can persist their data to session or local storage.

State decorators are applied on properties. There are two available state decorators:
* __@state.session__ -  Stores the data in browser session storage, which is persisted till the browser session is closed.
* __@state.persisted__ -  Stores the data in browser local storage, which is persisted permanently until manually cleared.

```typescript
export class MyDataService {
    // The default - in-memory storage
    public inMemory: string;

    // Session storage
    @state.session
    public inSession: number;

    // Local storage
    @state.persisted
    public inLocal: boolean;
}
```

### Storage service
The package also provides an Angular service to directly access and manipulate session and local storage.

This service is called `storageService`.

```typescript
@Page({selector: 'my-page'}, {
    path: '/my-page',
    parent: 'main-layout'
})
export class MyPage {
    constructor(private storageService: ng1Template.core.StorageService) {
    }

    public $onInit() {
        // Read data from session storage
        let sampleData = this.storageService.getSession('sample');

        // Write data to local storage
        this.storageService.setLocal('sample', sampleData);

        // Remove entry from session storage
        this.storageService.removeSession('sample');
    }
}
```
