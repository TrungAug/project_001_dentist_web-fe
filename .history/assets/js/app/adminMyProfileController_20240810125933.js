app.controller('AdminMyProfileController', function ($scope, $http, $rootScope, $location, $timeout, API, $route, adminBreadcrumbService, processSelect2Service) {
    let url = API.getBaseUrl();
    // let headers = API.getHeaders();
    let headers = {
        Authorization: "Bearer " + "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0cnVuZzEyODk0QGdtYWlsLmNvbSIsImlhdCI6MTcyMzI2MjEwOCwiZXhwIjoxNzIzMzQ4NTA4fQ.AYo9IrfSIjRoo38Ee2Hz_RgKC9ZaT4_oHyaL86DbCl4",
        "X-Refresh-Token": localStorage.getItem("refreshToken"),
    }
    adminBreadcrumbService.generateBreadcrumb()
    // code here

    //let role = "BAC_SI"
    let account = null
    $scope.srcImage = ""
    $scope.getUser = async () => {
        await $http.get(url + "/get-user-by-token", { headers: headers }).then(response => {
            account = response.data
        })
    }

    $scope.getImg = async () => {
        await $scope.getUser()
        const roleName = account.role?.roleName;
        const filename = account.doctor?.image;
        if (!filename) {
            return ""
        }
       
        let srcImage = url + (roleName === "BAC_SI" ? "/imgDoctor/" : "/imgStaff/") + filename
        console.log("srcImage", srcImage);
        return srcImage
         
    }
  
    // (async () => {
    //     try {
    //         await $scope.getUser()
    //         const roleName = account.role?.roleName;
    //         const filename = account.doctor?.image;
    //         if (!filename) {
    //             return ""
    //         }
    //         $scope.srcImage = url + (roleName === "BAC_SI" ? "/imgDoctor/" : "/imgStaff/") + filename       
    //         console.log("$scope.srcImage",$scope.srcImage);
    //     } catch (error) {
    //         console.error("Error retrieving user:", error);
    //     }
    // })()


})