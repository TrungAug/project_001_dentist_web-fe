app.controller('AdminSideBarController', function ($scope, $http, $rootScope, $location, $timeout, processSelect2Service, TimezoneService, $route, convertMoneyService, API, adminBreadcrumbService) {
    let url = API.getBaseUrl();
    let headers = API.getHeaders();
    $scope.roleName = API.getUser()?API.getUser().split("-")[1]:null

    console.log("roleName",$scope.roleName);

    // QUAN_LY
    // HANH_CHINH
    // BAC_SI
    // BENH_NHAN
    // KY_THUAT
    
})