app.controller('homeController', function ($scope, $location, $http, $routeParams, $log, session, $rootScope) {
    //session.setSessionKey($routeParams.sessionKey);
    //session.getCustomerInfo();
  $scope.isHome = $location.$$path.indexOf('/home') != -1;
    if ($rootScope.sessionKeyWasUpdatedFromRoute) {
        session.getCustomerInfo();
    } else {
        $scope.$on('sessionKeyUpdatedFromRoute', function () {
            session.getCustomerInfo();
        });
    };
});