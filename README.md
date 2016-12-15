# Angular 1.x Template Core Package
Core package for the Angular 1.5 template, with essential decorators, services and types.

## Component-specific decorators
These decorators can be applied to any kind of component, including pages and layouts, unless otherwise specified.

### Resolve decorators
Resolve decorators simplify the work needed to write resolve logic that is executed during route navigation. Since resolve blocks are executed only during route changes, these decorators can only be applied to pages (components with routes).

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
