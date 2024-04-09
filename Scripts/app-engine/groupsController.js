app.controller('groupsController', function ($scope,commonApiService) {
     (function () {
        commonApiService.getProductGroups()
            .then(function (data) {
                if ($scope.$parent) {
                    $scope.$parent.excMessage = data.excMessage;
                }
                $scope.productGroups = data.productGroups;
                console.log(data.productGroups,'data.productGroups')
            });
    })();
});