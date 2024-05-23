app.controller('headerController', function (
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
  $scope.search = {
    query: null,
    productSearchResult: []
  }
  // $scope.forceHideDropdown = false

  $scope.customHoverIn = function () {
    console.log('customHoverIn')
    let hasGroupSubcategories = false
    $scope.groupsWithCategories && $scope.groupsWithCategories.map((groupWithSubcat) => {
      if (groupWithSubcat.id === $scope.productGroups[0].id) {
        hasGroupSubcategories = true
      }
    })

   
    if (hasGroupSubcategories) {
      $('.product-gallery-link').first().css('color', '#000000')
      $scope.showExpandedMenu = true
      $('.tooltip-wrapper').css('box-shadow', 'unset')
      $('.tooltip-wrapper').css('height', 'auto')
      $('.tooltip-wrapper').css('min-height', '375px')
      $('.tooltip-main-wrapper').css('min-width', '983px')
      // $('.tooltip-main-wrapper').css('display', 'flex')
      $('.expanded-category-panel').css('box-shadow', 'none')
      $('.tooltip-wrapper').css('border-width', '0')
      $('.tooltip-wrapper').css('border', 'none !important')
      $scope.chosenGroup = $scope.productGroups[0]
    } 
  }
  $scope.hoverIn = function (e,groupInfo) {
    let hasGroupSubcategories = false
    $scope.groupsWithCategories.map((groupWithSubcat) => {
      if (groupWithSubcat.id === groupInfo.id) {
        hasGroupSubcategories = true
      }
    })
     $('.product-gallery-link').first().css('color', 'unset')
    if (hasGroupSubcategories) {
      $scope.showExpandedMenu = true
      $('.tooltip-wrapper').css('box-shadow', 'unset')
      $('.tooltip-wrapper').css('height', 'auto')
      $('.tooltip-wrapper').css('min-height', '375px')
      $('.tooltip-main-wrapper').css('min-width', '983px')
      // $('.tooltip-main-wrapper').css('display', 'flex')
      $('.expanded-category-panel').css('box-shadow', 'none')
      $('.tooltip-wrapper').css('border-width', '0')
      $('.tooltip-wrapper').css('border', 'none !important')
      
      $scope.chosenGroup = groupInfo
    } else {
      $scope.showExpandedMenu = false
      $scope.chosenGroup = {
        'description': '',
        'id': 507,
        'name': 'Punchout Main Group',
        'parentId': -1,
        'products': null,
        '$$hashKey': 'object:134'
      }

      $('.tooltip-main-wrapper').css('width', '236px')
      // $('.tooltip-main-wrapper').css('display', 'unset')
      $('.tooltip-main-wrapper').css('min-width', '236px')
      $('.tooltip-wrapper').css('height', 'auto')
    }
  }

  $scope.hoverOut = function () {
    $scope.showExpandedMenu = false
    $scope.chosenGroup = {
      'description': '',
      'id': 507,
      'name': 'Punchout Main Group',
      'parentId': -1,
      'products': null,
      '$$hashKey': 'object:134'
    }
    $('.tooltip-main-wrapper').css('width', '236px')
    $('.tooltip-main-wrapper').css('min-width', '236px')
    // $('.tooltip-main-wrapper').css('display', 'unset')
    $('.tooltip-wrapper').css('height', 'auto')
  }


  const container = document.querySelectorAll('.header-product-gallery')

  function detectWrap (node) {
    for (const container of node) {
      for (const child of container.children) {
        if (child.offsetTop > container.offsetTop) {
          child.classList.add('wrapped')
        } else {
          child.classList.remove('wrapped')
        }
      }
    }
  }

  window.addEventListener('DOMContentLoaded', e => {
    detectWrap(container)
  })

  window.addEventListener('resize', e => {
    detectWrap(container)

    // if (window.innerWidth < 1199) {
    //   $scope.forceHideDropdown = true
    // }
  })

  const myInterval = setInterval(adaptiveTabsCheck, 3000)

  function myStopFunction () {
    clearInterval(myInterval)
  }

  function adaptiveTabsCheck () {
    if ($('.child-toggle').hasClass('wrapped')) {
      myStopFunction()
    } else {
      detectWrap(container)
    }
  }

  $scope.session = session
  $scope.isHome = $location.$$path.indexOf('/home') != -1
  $scope.sendSearchRequest = function () {
    if ($scope.session.settings.showProductSearch) {
      if ($scope.search.query) {
        $scope.usSpinnerService.spin('spinner-2')
        $http.get('Service/Service.svc/GetProductsForSearch', {
          params: {
            sessionKey: session.getSessionKey(),
            searchQuery: $scope.search.query
          }
        }).then(function (response) {
            $scope.usSpinnerService.stop('spinner-2')
            session.rootScope.searchResult = response.data.products
            $location.path('/searchResult')
            //$scope.search.productSearchResult = response.data.products;
            //$timeout($scope.showSearchResults, 100);
          },
          function (error) {
            $scope.usSpinnerService.stop('spinner-2')
            uStoreSkinHelper.handleError(arguments)
          })
      } else {
        $scope.hideSearchResults()
        $scope.productSearchResult = []
      }
    }
  }

  $scope.goToSearchResult = function () {
    $('#search').blur()
    $location.path('/searchResult')
  }

  $scope.hideSearchResults = function () {
    $('#search').popover('hide')
  }

  $scope.hideSearchResults()

  $scope.showSearchResults = function () {
    if ($scope.search.query) {
      $('#search').popover({
        content: function () {
          var content = $('div.search-result').html()
          //$log.debug('content', content);
          return content
        },
        trigger: 'manual',
        html: true,
        placement: 'bottom'
      })
        .popover('show')
    }
  }

  $scope.onSearchTextChange = function () {
    //$log.debug($scope.search.query);
    var query = $scope.search.query
    if (!query) {
      $scope.hideSearchResults()
      return
    }
    $scope.sendSearchRequest(!$scope.session.settings.showPopUpSearch)

  }

  $scope.changeCulture = function (selectedCulture) {
    //$http.post('Service/Service.svc/SetCultureId', {
    //    sessionKey: session.getSessionKey(),
    //    cultureId: selectedCulture.id
    //})
    commonApiService.changeCulture(selectedCulture)
      .then(function () {
        location.reload()
      })
  }

  $scope.initCulture = function (selectedCulture) {
    session.rootScope.selectedCulture = _.find(session.settings.cultures,
      function (_) {
        return _.selected
      })
  }

  $(function () {
    $('.father-toggle').hover(function () {
        $(this).addClass('open')
      },
      function () {
        $(this).removeClass('open')
      })
  })

  // $scope.$on("settingsAreReady", function (data) {
  // GetProductGroups
  //$timeout(function () {
  $scope.loadProductGroups = function () {
    //$http.get('Service/Service.svc/GetProductGroups', {
    //    params: {
    //        sessionKey: session.getSessionKey()
    //    }
    //})
    commonApiService.GetProductGroupsList()
      .then(function (data) {
        if ($scope.$parent) {
          $scope.$parent.excMessage = data.excMessage
        }
        $scope.productGroupsList = data.productGroupsList

        const arrSubgroups = []
        const arrSubCategories = []
        let groupsWithCategories = []
        $scope.productGroupsList && $scope.productGroupsList.map((item) => {
          if (item.parentId > 0)
            arrSubgroups.push(item.parentId)
            arrSubCategories.push(item)
        })
        $scope.arrSubCategories = arrSubCategories
        arrSubgroups.map((subgroupParentId) => {
          $scope.productGroupsList && $scope.productGroupsList.map((group) => {
            if (subgroupParentId === group.id) {
              groupsWithCategories.push(group)
            }
          })
        })
        $scope.groupsWithCategories = groupsWithCategories
        console.log($scope.groupsWithCategories, 'groupsWithCategories')
        console.log($scope.productGroupsList, '$scope.productGroupsList')
      })

    commonApiService.getProductGroups()
      .then(function (data) {
        if ($scope.$parent) {
          $scope.$parent.excMessage = data.excMessage
        }
        $scope.productGroups = data.productGroups
        console.log($scope.productGroups, '$scope.productGroups ')
      })
  }
  //}, 500);
  //});

  if ($rootScope.sessionKeyWasUpdatedFromRoute) {
    $scope.loadProductGroups()
  } else {
    $scope.$on('sessionKeyUpdatedFromRoute', function () {
      $scope.loadProductGroups()
    })
  }

  $scope.isActive = function (viewLocation) {
    return viewLocation === $location.path()
  }

  $scope.exit = function (immediately) {

    if (!$scope.session.rootScope.maySignOut)
      return

    var msg = 'This action will delete all items within your cart and return back to procurement system. Would you like to continue?'
    if ($scope.customer.itemsInCart == 0 || confirm(msg)) {
      $window.location.href = 'Cancel.aspx?sessionKey=' + session.getSessionKey()
    }
  }

})

