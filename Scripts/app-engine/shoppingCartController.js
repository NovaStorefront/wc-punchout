app.controller('shoppingCartController', function ($scope, $http, $routeParams, $log, $window, $sce, session, $timeout, commonApiService) {

    $log.debug($routeParams);
    $scope.session = session;
    //$scope.session.setSessionKey($routeParams.sessionKey);
    $scope.proofLink = '';
    $scope.punchOutUrl = '';
    $scope.Params = {};

    $scope.$watch('shoppingCart', function (n, o) {
        if (n != o) {
            var shoppingCart = n;
            if (shoppingCart && shoppingCart.orderProducts) {
                // update items in card
                $scope.session.rootScope.customer.itemsInCart = shoppingCart.orderProducts.length;
            }
        }
    });

    $scope.session.getCustomerInfo(function () {
        $scope.$parent.usSpinnerService.spin('spinner-1');
        //if ($routeParams.OrderProductId) {
        //    $scope.session.rootScope.maySignOut = false;
        //    $http.get('Service/Service.svc/AddOrderProduct', {
        //        params: {
        //            sessionKey: session.getSessionKey(),
        //            orderProductId: $routeParams.OrderProductId
        //        }
        //    }).then(function (response) {
        //        $scope.usSpinnerService.stop('spinner-1');
        //        var result = response.data;

        //        if ($scope.$parent) {
        //            $scope.$parent.excMessage = result.excMessage;
        //        }

        //        $scope.shoppingCart = result.shoppingCart;
        //        $scope.session.rootScope.maySignOut = true;
        //    }, function (response) {
        //        $scope.$parent.excMessage = response.statusText;
        //        $scope.usSpinnerService.stop('spinner-1');
        //    });
        //} else {
        //    $http.post('Service/Service.svc/GetShoppingCart', {
        //        sessionKey: session.getSessionKey()
        //    }).then(function (response) {
        //        $scope.usSpinnerService.stop('spinner-1');
        //        var result = response.data.GetShoppingCartResult;

        //        if ($scope.$parent) {
        //            $scope.$parent.excMessage = result.excMessage;
        //        }

        //        $scope.shoppingCart = result.shoppingCart;
        //    }, function (response) {
        //        $scope.$parent.excMessage = response.statusText;
        //        $scope.usSpinnerService.stop('spinner-1');
        //    });
        //}
        if ($routeParams.OrderProductId) {
            $scope.session.rootScope.maySignOut = false;
            commonApiService.addOrderProduct($routeParams.OrderProductId)
                .then(function (data) {
                    $scope.usSpinnerService.stop('spinner-1');

                    if ($scope.$parent) {
                        $scope.$parent.excMessage = data.excMessage;
                    }

                    $scope.shoppingCart = data.shoppingCart;
                    $scope.session.rootScope.maySignOut = true;
                }, function (err) {
                    $scope.$parent.excMessage = err;
                    $scope.usSpinnerService.stop('spinner-1');
                });
        } else {
            commonApiService.getShoppingCart()
                .then(function (data) {
                   
                    $scope.usSpinnerService.stop('spinner-1');
                    var result = data.GetShoppingCartResult;
                    

                    //if ($scope.$parent) {
                    //    $scope.$parent.excMessage = result.excMessage;
                    //}

                    $scope.shoppingCart = result.shoppingCart;
                    //$scope.shoppingCart = data.ShoppingCart;
                    $scope.punchOutUrl = $sce.trustAsResourceUrl(data.Url);
                    $scope.Params = data.Message;
                }, function (response) {
                    $scope.$parent.excMessage = response.statusText;
                    $scope.usSpinnerService.stop('spinner-1');
                });
        }
    });

    $scope.showProof = function (orderProduct) {
       
        if (orderProduct.enableProofGeneration) {
            var url = 'ProofPreview.aspx'
                + '?opId=' + orderProduct.orderProductID
                + '&cId=' + $scope.$parent.customer.selectedCultureId;

            if ($scope.proofLink != url) {
                // clean previews preview before load
                $('#ProofDlgModal iframe')
                    .contents()
                    .find('body')
                    .hide();

                $timeout(function () {
                    // when dialog window is appearing, we do a timeout to avoid the unsmoothly animation
                    $scope.proofLink = url;
                }, 200)
            }
        }
    }

    $scope.getProductUnitName = function (info, num) {
      
        if (num) {
            return info.PluralName;
        }
        if (info.Plural) {
            return info.PluralName;
        }
        return info.Name;
    };

    $scope.getTotalProductUnitName = function (num, info) {
        
        if (num > 1) {
            return info.PluralName;
        }
        return info.Name;
    };

    $scope.delete = function (opId) {
        if (confirm("Click OK to delete the item from your shopping cart.")) {
            //$http.get('Service/Service.svc/DeleteOrderProduct', {
            //    params: {
            //        sessionKey: session.getSessionKey(),
            //        orderProductId: opId
            //    }
            //}).then(function (response) {
            //    if ($scope.$parent) {
            //        $scope.$parent.excMessage = response.data.excMessage;
            //    }
            //    $scope.shoppingCart = response.data.shoppingCart;
            //});
            commonApiService.deleteOrderProduct(opId)
                .then(function (data) {
                    if ($scope.$parent) {
                        $scope.$parent.excMessage = data.excMessage;
                    }
                    $scope.shoppingCart = data.shoppingCart;
                });
        }
    }

    $scope.edit = function (opId, prId) {

        //$http.get('Service/Service.svc/GetSingleSignonUrlToFinalizePage', {
        //    params: {
        //        sessionKey: session.getSessionKey(),
        //        orderProductId: opId
        //    }
        //}).then(function (response) {
        //    $log.debug(response)
        //    $scope.$parent.excMessage = response.data.excMessage;
        //    if (!response.data.excMessage) {
        //        $scope.usSpinnerService.spin('spinner-1');
        //        $window.location.href = response.data.singleSignonUrlToFinalizePage;
        //    }
        //});

        commonApiService.getSingleSigonUrlToOrderWizard(opId, prId)
            .then(function (data) {
                //$log.debug(response)
                $scope.$parent.excMessage = data.excMessage;
                if (!data.excMessage) {
                    $scope.usSpinnerService.spin('spinner-1');
                    $window.location.href = data.singleSigonUrlToOrderWizard;
                }
            });
    }

    $scope.submit = function () {
        $window.location.href = 'PostForm.aspx?sessionKey=' + session.getSessionKey();
        //$("#postForm").submit();
    }

    $scope.cancel = function (immediately) {
        if (immediately || confirm("Are you sure you want to delete all items and return back to procurement system?")) {
            $window.location.href = 'Cancel.aspx?sessionKey=' + session.getSessionKey();
        }
    }
});