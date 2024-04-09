
app.service('commonApiService', function ($http, $log, session, $q) {

    this.handleResponse = function (response) { return response.data; };

    this.handleError = function (errResponse) { return $q.reject(errResponse.statusText); };

    this.isSessionKeyExists = function () {
        var sessionKey = session.getSessionKey();
        return !!sessionKey;
    };

    this.handleSessionKeyNotExists = function () {
        return $q.resolve({ excMessage: 'SessionKey is not exists' });
    };

    //-----------------------------

    this.GetProductGroupsList = function () {
        if (!this.isSessionKeyExists()) return this.handleSessionKeyNotExists();

        return $http.get('Service/Service.svc/GetProductGroupsList', {
            params: { sessionKey: session.getSessionKey() }
        }).then(this.handleResponse, this.handleError);
    };

    this.getProductGroups = function () {
        if (!this.isSessionKeyExists()) return this.handleSessionKeyNotExists();

        return $http.get('Service/Service.svc/GetProductGroups', {
            params: { sessionKey: session.getSessionKey() }
        }).then(this.handleResponse, this.handleError);
    };

    this.getProductsForSearch = function (searchQuery) {
        if (!this.isSessionKeyExists()) return this.handleSessionKeyNotExists();

        return $http.get('Service/Service.svc/GetProductsForSearch', {
            params: {
                sessionKey: session.getSessionKey(),
                searchQuery: searchQuery
            }
        }).then(this.handleResponse, this.handleError);
    };

    this.changeCulture = function (selectedCulture) {
        if (!this.isSessionKeyExists()) return this.handleSessionKeyNotExists();

        return $http.post('Service/Service.svc/SetCultureId', {
            sessionKey: session.getSessionKey(),
            cultureId: selectedCulture.id
        });
    };

    this.getProducts = function (productGroupId) {
        if (!this.isSessionKeyExists()) return this.handleSessionKeyNotExists();

        return $http.get('Service/Service.svc/GetProducts', {
            params: {
                sessionKey: session.getSessionKey(),
                productGroupId: productGroupId
            }
        }).then(this.handleResponse, this.handleError);
    };

    this.addOrderProduct = function (orderProductId) {
        if (!this.isSessionKeyExists()) return this.handleSessionKeyNotExists();

        return $http.get('Service/Service.svc/AddOrderProduct', {
            params: {
                sessionKey: session.getSessionKey(),
                orderProductId: orderProductId
            }
        }).then(this.handleResponse, this.handleError);
    };

    this.AddOrderProductToCart = function (productId, quantity) {
        if (!this.isSessionKeyExists()) return this.handleSessionKeyNotExists();

        return $http.get('Service/Service.svc/AddQuantityOfOrderProductToCart', {
            params: {
                sessionKey: session.getSessionKey(),
                productId: productId,
                quantity: quantity
            }
        }).then(this.handleResponse, this.handleError);
    };

    this.getShoppingCart = function () {
        if (!this.isSessionKeyExists()) return this.handleSessionKeyNotExists();

        return $http.post('Service/Service.svc/GetShoppingCart', {
            sessionKey: session.getSessionKey()
        }).then(this.handleResponse, this.handleError);
    };

    this.deleteOrderProduct = function (orderProductId) {
        if (!this.isSessionKeyExists()) return this.handleSessionKeyNotExists();

        return $http.get('Service/Service.svc/DeleteOrderProduct', {
            params: {
                sessionKey: session.getSessionKey(),
                orderProductId: orderProductId
            }
        }).then(this.handleResponse, this.handleError);
    };

    this.getSingleSignonUrlToFinalizePage = function (orderProductId) {
        if (!this.isSessionKeyExists()) return this.handleSessionKeyNotExists();

        return $http.get('Service/Service.svc/getSingleSignonUrlToFinalizePage', {
            params: {
                sessionKey: session.getSessionKey(),
                orderProductId: orderProductId
            }
        }).then(this.handleResponse, this.handleError);
    };

    this.getSingleSigonUrlToOrderWizard = function (orderProductId, productId) {
        if (!this.isSessionKeyExists()) return this.handleSessionKeyNotExists();

        return $http.get('Service/Service.svc/getSingleSigonUrlToOrderWizard', {
            params: {
                sessionKey: session.getSessionKey(),
                orderProductId: orderProductId,
                productId: productId
            }
        }).then(this.handleResponse, this.handleError);
    };
});

