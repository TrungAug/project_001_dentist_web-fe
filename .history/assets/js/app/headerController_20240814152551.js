app.controller('HeaderController', function ($scope, $http, $rootScope, $location, $timeout, $window, API, $route, adminBreadcrumbService, processSelect2Service) {
    let url = API.getBaseUrl();
    let headers = API.getHeaders();
    $scope.isLogin = localStorage.getItem("isLogin")
    console.log("$scope.isLogin", $scope.isLogin);

    console.log("header");
    



    $scope.initData()
    $scope.getGetCancelStatus()
});
