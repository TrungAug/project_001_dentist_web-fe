app.controller('AdminMyProfileController', function ($scope, $http, $rootScope, $location, $timeout, API, $route, adminBreadcrumbService, processSelect2Service) {
    let url = API.getBaseUrl();
    let headers = API.getHeaders();
    adminBreadcrumbService.generateBreadcrumb()
    // code here
    let accountId = API.getUser().split("-")[0]
    let roleName = API.getUser().split("-")[1]

    console.log("accountId",accountId);
    console.log("roleName",roleName);
    
    

    // $scope.urlImgDisplay = () => {
    //     return url + "/imgDoctor/" + filename;
    // }



})