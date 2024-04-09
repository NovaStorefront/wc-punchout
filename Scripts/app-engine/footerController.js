app.controller('footerController', function (
    $scope,
    $location,
    $http,
    $routeParams,
    $timeout,
    session,
    $window,
    $log,
    $rootScope,
    commonApiService
) {
    $scope.session = session;

    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
});