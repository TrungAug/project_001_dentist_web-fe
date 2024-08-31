app.controller('AdminMyProfileController', function ($scope, $http, $rootScope, $location, $timeout, API, $route, adminBreadcrumbService, processSelect2Service) {
    let url = API.getBaseUrl();
    let headers = API.getHeaders();
    adminBreadcrumbService.generateBreadcrumb()
    // code here
    let accountId = API.getUser().split("-")[0]
    let roleName = API.getUser().split("-")[1]
    let email=API.getUser().split("-")[2]
    $scope.account=null

    $scope.getAccount=(email)=>{
        let param={
            email:email
        }
        $http.get(url+"/get-user-by-email",{headers:headers},{params:param}).then(response=>{
            $scope.account=response.data
        })
    }
    console.log("accountId",accountId);
    console.log("roleName",roleName);
    console.log("email",email);
    console.log("API.getUser()",API.getUser());
    


    // $scope.urlImgDisplay = () => {
    //     return url + "/imgDoctor/" + filename;
    // }



})