app.controller('productsController', function ($scope, $http, $routeParams, $log, $window, session, $location, commonApiService) {

    var bootstrapGridSizes = { xs: 0, sm: 768, md: 992, lg: 1200 };
    var path = $location.$$path.toLowerCase();

    $scope.$routeParams = $routeParams;
    $scope.$location = $location;
    $scope.isHome = $location.$$path.indexOf('/home') != -1;
    $scope.session = session;

    $log.debug("$routeParams", $routeParams);
    $log.debug("$location", $location);

    $scope.session.getCustomerInfo();

    $scope.getBootstrapSizeMetric = function (windowInnerWidth) {
        if (windowInnerWidth >= bootstrapGridSizes.lg)
            return bootstrapGridSizes.lg;
        if (windowInnerWidth >= bootstrapGridSizes.md)
            return bootstrapGridSizes.md;
        if (windowInnerWidth >= bootstrapGridSizes.sm)
            return bootstrapGridSizes.sm;
        if (windowInnerWidth < bootstrapGridSizes.sm)
            return bootstrapGridSizes.xs;
    };

    $scope.composedProducts = [];
    $scope.persistedWindowSize = $scope.getBootstrapSizeMetric($window.innerWidth);

    $scope.handleNewWindowSize = function (newVal) {
        var actualWindowSize = $scope.getBootstrapSizeMetric(newVal);
        if (actualWindowSize != $scope.persistedWindowSize) {
            $scope.persistedWindowSize = actualWindowSize;
            $scope._recomposeProducts();
        }
    };

    // (function () {
    //     if($scope.isHome){
    //     commonApiService.getProductGroups()
    //         .then(function (data) {
    //             if ($scope.$parent) {
    //                 $scope.$parent.excMessage = data.excMessage;
    //             }
    //             $scope.productGroups = data.productGroups;
    //             console.log($scope.productGroups,'getProductGroups()')
    //         });
    //     }
    // })();

    $scope._recomposeProducts = function () {
        var itemsPerRow = 0;
        switch ($scope.persistedWindowSize) {
            case bootstrapGridSizes.xs:
                itemsPerRow = 1;
                break;
            case bootstrapGridSizes.sm:
                itemsPerRow = 2;
                break;
            case bootstrapGridSizes.md:
                itemsPerRow = 3;
                break;
            case bootstrapGridSizes.lg:
                itemsPerRow = 4;
                break;
        }
        $scope.composedProducts = _.chunk($scope.products, itemsPerRow);
    };

    var w = angular.element($window);
    w.bind('resize', function () {
        $scope.$apply();
    });

    $scope.$watch(
        function () {
            return $window.innerWidth;
        },
        $scope.handleNewWindowSize,
        true);

    if (path.indexOf('searchresult') != -1) {
        $scope.$watch(function () {
            return session.rootScope.searchResult
        }, function (searchResult) {
            console.log('searchResult', searchResult);

            var productId = parseInt($routeParams.productId) ? $routeParams.productId : -1;
            console.log('productId', productId);

            $scope.products = productId > -1
                ? _.filter(searchResult, function (_) { return _.id == productId; })
                : searchResult;

            $scope._recomposeProducts();
        });
    } else {
        // GetProducts
        var spinernanme = $routeParams.productGroupId > 0 ? 'spinner-1' : 'spinner-2';
        $scope.usSpinnerService.spin(spinernanme);
        //$http.get('Service/Service.svc/GetProducts', {
        //    params: {
        //        sessionKey: session.getSessionKey(),
        //        productGroupId: parseInt($routeParams.productGroupId) ? $routeParams.productGroupId : -1
        //    }
        //}).then(function (response) {

        //    $scope.usSpinnerService.stop(spinernanme);

        //    if ($scope.$parent) {
        //        $scope.$parent.excMessage = response.data.excMessage;
        //    }

        //    //productGroup
        //    $scope.productGroup = response.data.productGroup;

        //    //products
        //    $scope.products = response.data.products;
        //    $scope._recomposeProducts();

        //    //productGroups
        //    $scope.productGroups = response.data.productGroups;

        //    angular.forEach($scope.productGroups, function (g) {
        //        g.products = _.sampleSize(g.products, 3);
        //    });

        //    $scope.productGroups = _.sortBy($scope.productGroups, function (o) { return o.Name; }).reverse();
        //    $scope.composedPproductGroups = _.chunk($scope.productGroups, 3);
        //    _($scope.composedPproductGroups).forEach(function (value) {
        //        _.reverse(value);
        //    });
        //    $scope.composedPproductGroups = _.reverse($scope.composedPproductGroups);

        //    //breadCrumbs
        //    $scope.breadCrumbs = response.data.breadCrumbs;
        //}, function (response) {
        //    $scope.excMessage = response.statusText;
        //    $scope.usSpinnerService.stop('spinner-1');
        //});

        var productGroupId = parseInt($routeParams.productGroupId) ? $routeParams.productGroupId : -1;
        commonApiService.getProducts(productGroupId).then(
            function (data) {
                $scope.usSpinnerService.stop(spinernanme);

                if ($scope.$parent) {
                    $scope.$parent.excMessage = data.excMessage;
                }

                //productGroup
                $scope.productGroup = data.productGroup;

                //products
                $scope.products = data.products;
                console.log(data,'data');
                $scope._recomposeProducts();

                //productGroups
                $scope.productGroups = data.productGroups;
                console.log($scope.productGroups)
                angular.forEach($scope.productGroups, function (g) {
                    g.products = _.sampleSize(g.products, 3);
                });

                $scope.productGroups = _.sortBy($scope.productGroups, function (o) { return o.Name; }).reverse();
                $scope.composedPproductGroups = _.chunk($scope.productGroups, 3);
                _($scope.composedPproductGroups).forEach(function (value) {
                    _.reverse(value);
                });
                $scope.composedPproductGroups = _.reverse($scope.composedPproductGroups);

                //breadCrumbs
                $scope.breadCrumbs = data.breadCrumbs;
                console.log($scope.productGroups,'productGroups from getProducts()')
            },
            function (err) {
                $scope.excMessage = err;
                $scope.usSpinnerService.stop('spinner-1');
            });
    }

    $scope.goToUStore = function (productId) {
        session.goToUStore(
            productId,
            $scope.productGroup ? $scope.productGroup.id : null);
    };

    $scope.inventoryClass = function (product) {
        // console.log(arguments);
        return product.productInventory.outOfStock == '' ? 'inStock' : 'soldOut';
    };

    $scope.addToCard = function (productId, product) {
        var spinernanme = $routeParams.productGroupId > 0 ? 'spinner-1' : 'spinner-2';
        $scope.usSpinnerService.spin(spinernanme);
        var quantity = $('#quantity_' + productId).val();
        
        if (!product.Changeable && product.MinUnitsPerOrder) {
            quantity = product.MinUnitsPerOrder;
        }
        console.log(quantity,'addToCard quantity')
        commonApiService.AddOrderProductToCart(productId, quantity).then(
            function (data) {
                console.log(data);
                $scope.session.getCustomerInfo();
                if (data.excMessage === "") {
                    $scope.usSpinnerService.stop(spinernanme);
                    $('.add_to_card_controll_'+productId).hide();
                    $('#add_to_card_success_' + productId).show();

                    setTimeout(function () {
                        $('#add_to_card_success_' + productId).hide();
                        $('.add_to_card_controll_' + productId).show();
                    }, 3000);

                } else {
                    $scope.excMessage = data.excMessage;
                    $scope.usSpinnerService.stop('spinner-1');
                    alert('Error: ' + data.excMessage);
                }
            },
            function (err) {
                $scope.excMessage = err;
                $scope.usSpinnerService.stop('spinner-1');
            }
            );
        
    }

    $scope.plusQuantity = function (product) {
        var currentValue = $('#quantity_' + product.id).val();
        var result = parseInt(currentValue) + 1;
        $('#quantity_' + product.id).val(result);
        setTimeout(() => {
            var quantity = $('#quantity_' + product.id).val();

            if (product.MinUnitsPerOrder && parseInt(quantity) < product.MinUnitsPerOrder) {
                $('.min_validation_custom_alert_controll_' + product.id).show();
            } else {
                $('.min_validation_custom_alert_controll_' + product.id).hide();
            }

            if (product.MaxUnitsPerOrder && parseInt(quantity) > product.MaxUnitsPerOrder) {
                $('.max_validation_custom_alert_controll_' + product.id).show();
            } else {
                $('.max_validation_custom_alert_controll_' + product.id).hide();
            }

            if (product.storeInventoryQuantity > 0 && parseInt(quantity) > product.storeInventoryQuantity) {
                $('.validation_alert_controll_' + product.id).show();
            } else {
                $('.validation_alert_controll_' + product.id).hide();
            }
        }, 70)
    }


    $scope.minusQuantity = function (product) {
        var currentValue = $('#quantity_' + product.id).val();
        if (currentValue > 1) {
            var result = currentValue - 1;
            $('#quantity_' + product.id).val(result);
        }
        
        setTimeout(() => {
            var quantity = $('#quantity_' + product.id).val();

            if (product.MinUnitsPerOrder && parseInt(quantity) < product.MinUnitsPerOrder) {
                $('.min_validation_custom_alert_controll_' + product.id).show();
            } else {
                $('.min_validation_custom_alert_controll_' + product.id).hide();
            }

            if (product.MaxUnitsPerOrder && parseInt(quantity) > product.MaxUnitsPerOrder) {
                $('.max_validation_custom_alert_controll_' + product.id).show();
            } else {
                $('.max_validation_custom_alert_controll_' + product.id).hide();
            }

            if (product.storeInventoryQuantity > 0 && parseInt(quantity) > product.storeInventoryQuantity) {
                $('.validation_alert_controll_' + product.id).show();
            } else {
                $('.validation_alert_controll_' + product.id).hide();
            }
        }, 70)
    }

    $scope.changeQuantityFromSelect = function (id) {
        $('#quantity_' + id).val(3);
    }

    $scope.checkQuantityValid = function (product) {
        setTimeout(() => {
            var quantity = $('#quantity_' + product.id).val();

            if (product.MinUnitsPerOrder && parseInt(quantity) < product.MinUnitsPerOrder) {
                $('.min_validation_custom_alert_controll_' + product.id).show();
            } else {
                $('.min_validation_custom_alert_controll_' + product.id).hide();
            }

            if (product.MaxUnitsPerOrder && parseInt(quantity) > product.MaxUnitsPerOrder) {
                $('.max_validation_custom_alert_controll_' + product.id).show();
            } else {
                $('.max_validation_custom_alert_controll_' + product.id).hide();
            }

            if (product.storeInventoryQuantity > 0 && parseInt(quantity) > product.storeInventoryQuantity) {
                $('.validation_alert_controll_' + product.id).show();
            } else {
                $('.validation_alert_controll_' + product.id).hide();
            }
        }, 70)
        
    }
});

function changeQuantity(element) {
    setTimeout(() => {
        var productId = parseInt(element.context.getAttribute("productid"));
        var value = element.val();
        if (!value || value === '0') {
            $('.validation_custom_alert_controll_' + productId).show();
        } else {
            $('.validation_custom_alert_controll_' + productId).hide();
        }
    }, 70)
    
}