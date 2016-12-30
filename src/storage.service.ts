namespace ng1Template.core {
    /**
     * Angular service that exposes the HTML5 local storage and session storage capabilities.
     */
    export class StorageService {
        public static $inject = ['$window'];

        constructor(private $window: ng.IWindowService) {
            if (typeof Storage === 'undefined') {
                throw Error(`This browser does not support local or session storage.`);
            }
        }

        public getLocal(key: string): any {
            return angular.fromJson(this.$window.localStorage.getItem(key));
        }

        public getSession(key: string): any {
            return angular.fromJson(this.$window.sessionStorage.getItem(key));
        }

        public removeLocal(key: string): void {
            this.$window.localStorage.removeItem(key);
        }

        public removeSession(key: string): void {
            this.$window.sessionStorage.removeItem(key);
        }

        public setLocal(key: string, value: any): void {
            this.$window.localStorage.setItem(key, angular.toJson(value));
        }

        public setSession(key: string, value: any): void {
            this.$window.sessionStorage.setItem(key, angular.toJson(value));
        }
    }

    coreModule.service('storageService', StorageService);
}
