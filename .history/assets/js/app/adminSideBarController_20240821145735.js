app.controller('AdminSideBarController', function ($scope, $http, $rootScope, $location, $timeout, processSelect2Service, TimezoneService, $route, convertMoneyService, API, adminBreadcrumbService) {
    let url = API.getBaseUrl();
    let headers = API.getHeaders();
    let roleName = API.getUser()?API.getUser().split("-")[1]:null
})