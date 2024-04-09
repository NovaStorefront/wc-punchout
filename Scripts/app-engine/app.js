/// <reference path="../lodash.js" />
/// <reference path="custom-app.js" />

var app = angular.module('app', ['ngRoute', 'angularSpinner', 'ngSanitize']);
app.config(['$routeProvider',
    function ($routeProvider, $routeParams) {
        $routeProvider.
            when('/home', {
                templateUrl: 'Content/html-templates/home.html',
                controller: 'homeController'
            }).
            when('/home/:sessionKey', {
                templateUrl: 'Content/html-templates/home.html',
                controller: 'homeController'
            }).
            when('/products/:productGroupId', {
                templateUrl: 'Content/html-templates/products.html',
                controller: 'productsController'
            })
            .when('/shoppingCart', {
                templateUrl: 'Content/html-templates/shoppingCart.html',
                controller: 'shoppingCartController'
            }).
            when('/shoppingCart/:sessionKey', {
                templateUrl: 'Content/html-templates/shoppingCart.html',
                controller: 'shoppingCartController'
            }).
            when('/customerInfo', {
                templateUrl: 'Content/html-templates/customerInfo.html',
                controller: 'customerInfoController'
            }).
            when('/help', {
                templateUrl: 'Content/html-templates/help.html',
                controller: 'helpInfoController'
            }).
            when('/searchResult/:productId', {
                templateUrl: 'Content/html-templates/searchResult.html',
                controller: 'productsController'
            }).
            when('/searchResult', {
                templateUrl: 'Content/html-templates/searchResult.html',
                controller: 'productsController'
            }).
            when('/submissionForm', {
                templateUrl: 'Content/html-templates/submissionForm.html',
                controller: 'submissionFormController'
            }).
            when('/privacy', {
                templateUrl: 'Content/html-templates/privacy.html',
                controller: 'helpInfoController'
            }).
            when('/terms', {
                templateUrl: 'Content/html-templates/terms.html',
                controller: 'helpInfoController'
            });

        if (typeof setCustomRoute === "function") {
            setCustomRoute($routeProvider);
        }

        $routeProvider.
            otherwise({
                redirectTo: '/home'
            });
    }]);

app.controller('controller', function ($scope, usSpinnerService, session, $location, $routeParams, $log, $rootScope) {
    $scope.excMessage = '';
    $scope.usSpinnerService = usSpinnerService;
    $scope.appPrefix = 'uStorePunchOut2_';
    session.rootScope = $scope;
    $scope.$location = $location;
    $scope.session = session;
    $rootScope.sessionKeyWasUpdatedFromRoute = false;


    $scope.$on("sessionKeyUpdatedFromRoute", function (data) {
        session.getSettings();
    });

    $scope.$on('$routeChangeSuccess', function () {
        session.setSessionKey($routeParams.sessionKey);
        $rootScope.sessionKeyWasUpdatedFromRoute = true;
        //session.getSettings();
        $scope.$broadcast("sessionKeyUpdatedFromRoute");
    });
});

