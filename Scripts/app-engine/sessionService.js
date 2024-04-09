/// <reference path="../lodash.js" />

app.service('session', function ($http, $window, $routeParams, $log) {

    var self = this;

    function set(name, value) {
        if (!_.isEmpty(name)
            && !_.isEmpty(value)) {
            sessionStorage.setItem(self.rootScope.appPrefix + name, value);
        }
    }

    function get(name) {
        var value = 0;
        if (self.rootScope) {
            value = sessionStorage.getItem(self.rootScope.appPrefix + name);
        }
        return value ? value : 0;
    }

    function remove(name) {
        sessionStorage.removeItem(self.rootScope.appPrefix + name);
    }

    this.setSessionKey = function (value) {
        set('sessionKey', value);
    };

    this.getSessionKey = function () {
        var key = get('sessionKey')
        console.log('KEY DUMP', key);
        return key
    };

    this.removeSessionKey = function () {
        return remove('sessionKey')
    };

    this.getCustomerInfo = function (onReady) {
        $http.get('Service/Service.svc/GetCustomerInfo', {
            params: {
                sessionKey: self.getSessionKey()
            }
        }).then(function (response) {
            var d = response.data;
            self.rootScope.$parent.excMessage = d.excMessage;
            self.rootScope.$parent.customer = d.customer;
            self.rootScope.$parent.maySignOut = true;
            if (!d.customer.uStoreUserId) {
                self.removeSessionKey();
            }
            if (onReady) {
                onReady();
            }
        });
    };

    // redirect to uStore
    $window.goToUStore = function (productId, productGroupId) {

        if (productGroupId > 0 == false) {
            productGroupId = $routeParams.productGroupId;
        }

        self.goToUStore(productId, productGroupId);
    }

    this.goToUStore = function (productId, productGroupId) {
        // productGroupId is userd in return back url
       // if (product.productInventory.outOfStock == '') {
            $http.get('Service/Service.svc/GetSingleSignonUrlToProductDetails', {
                params: {
                    sessionKey: self.getSessionKey(),
                    productId: productId,
                    productGroupId: productGroupId
                }
            }).then(function (response) {
                var d = response.data;
                self.rootScope.$parent.excMessage = d.excMessage;
                if (!d.excMessage) {
                    self.rootScope.usSpinnerService.spin('spinner-1');
                    $window.location.href = d.singleSignonUrlToProductDetails;
                    self.rootScope.usSpinnerService.stop('spinner-1');
                }
            });
        // }

      
    }

    // settings

    this.getSettings = function () {
        $http.get('Service/Service.svc/GetSettings', {
            params: {
                sessionKey: self.getSessionKey()
            }
        }).then(function (response) {
            self.settings = response.data;
        });
       
    }



});