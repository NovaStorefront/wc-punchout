app.controller('customerInfoController', function ($scope, $http, session) {
    $scope.session = session;
    session.getCustomerInfo();

    $scope.clearuStoreCart = function () {
        $http.get('Service/Service.svc/ClearuStoreCart', {
            params: {
                sessionKey: session.getSessionKey()
            }
        }).then(function (response) {
            var d = response.data;
            $scope.$parent.excMessage = d.excMessage;
            alert('done');
        });
    }
});