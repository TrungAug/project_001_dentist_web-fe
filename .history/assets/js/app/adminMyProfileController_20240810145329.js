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
        console.log("eamil",email);
        
        // let param={
        //     email:email
        // }
        // $http.get(url+"/get-user-by-email",{headers:headers},{params:param}).then(response=>{
        //     $scope.account=response.data
        //     console.log("$scope.account",$scope.account);
            
        // })
    }
    
    
    $scope.getAccount(email)

    // $scope.urlImgDisplay = () => {
    //     return url + "/imgDoctor/" + filename;
    // }



})