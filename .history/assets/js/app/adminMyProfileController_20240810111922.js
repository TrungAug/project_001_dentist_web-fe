app.controller('AdminMyProfileController', function ($scope, $http, $rootScope, $location, $timeout, API, $route, adminBreadcrumbService, processSelect2Service) {
    let url = API.getBaseUrl();
    let headers = API.getHeaders();
    adminBreadcrumbService.generateBreadcrumb()
    // code here
    let accountId = $scope.getUser()
    let role = "BAC_SI"
   
    $scope.getUser=()=>{
       return $http.get(url+"/get-user-by-token",{headers:headers}).then(response=>{
            return response.data
        })
    }

    $scope.urlImgDisplay = (filename) => {
        if (role == "BAC_SI") {
            return url + "/imgDoctor/" + filename;
        }
        return url + "/imgStaff/" + filename;
    }

    // $scope.getAccount
})