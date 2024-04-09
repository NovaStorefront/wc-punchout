app.controller('submissionFormController', function ($scope, $http, session) {
    $scope.session = session;
    
    console.log('$scope.session', $scope.session);
});