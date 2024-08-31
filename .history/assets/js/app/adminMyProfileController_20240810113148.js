app.controller('AdminMyProfileController', function ($scope, $http, $rootScope, $location, $timeout, API, $route, adminBreadcrumbService, processSelect2Service) {
    let url = API.getBaseUrl();
    // let headers = API.getHeaders();
    let headers = {
        Authorization: "Bearer " + "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0cnVuZzEyODk0QGdtYWlsLmNvbSIsImlhdCI6MTcyMzI2MjEwOCwiZXhwIjoxNzIzMzQ4NTA4fQ.AYo9IrfSIjRoo38Ee2Hz_RgKC9ZaT4_oHyaL86DbCl4",
        "X-Refresh-Token": localStorage.getItem("refreshToken"),
    }
    adminBreadcrumbService.generateBreadcrumb()
    // code here
    
    let role = "BAC_SI"
   
    // $scope.getUser=()=>{
    //    return $http.get(url+"/get-user-by-token",{headers:headers}).then(response=>{
    //         return response.data
    //     })
    // }
    // let account = $http.get(url+"/get-user-by-token",{headers:headers}).then(response=>{
    //     return response.data
    // })

    $scope.getUser = async () => {
        try {
            const response = await $http.get(url + "/get-user-by-token", { headers: headers });
            return response.data;
        } catch (error) {
            throw error;  
        }
    };
    let account = $scope.getUser()
    console.log("account",account.$$state.value);
    
    
    $scope.urlImgDisplay = (filename) => {
        if (role == "BAC_SI") {
            return url + "/imgDoctor/" + filename;
        }
        return url + "/imgStaff/" + filename;
    }

    // $scope.getAccount
})