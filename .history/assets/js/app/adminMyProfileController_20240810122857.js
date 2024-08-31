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
    $scope.getUser = async () => {
        await $http.get(url + "/get-user-by-token", { headers: headers }).then(response => {
            console.log("response.data", response.data);
            account = response.data
        })
    }
    (async () => {
        try {
            await $scope.getUser();

            $scope.urlImgDisplay = () => {
                console.log("account lala", account);
                let roleName = account.role.roleName
                let filename=account.doctor.image
                let image=url + "/imgStaff/" + filename;
                if (roleName == "BAC_SI") {
                    image=url + "/imgDoctor/" + filename
                }
                console.log("image",image);
                
                return image
            }
            //$scope.urlImgDisplay()
        } catch (error) {
            console.error("Error retrieving user:", error);
        }
    })();



    // let account = $http.get(url+"/get-user-by-token",{headers:headers}).then(response=>{
    //     return response.data
    // })
    // console.log("account", account);



    // $scope.getAccount
})