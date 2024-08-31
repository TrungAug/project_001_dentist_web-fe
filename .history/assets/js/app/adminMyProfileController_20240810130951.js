app.controller('AdminMyProfileController', function ($scope, $http, $rootScope, $location, $timeout, API, $route, adminBreadcrumbService, processSelect2Service) {
    let url = API.getBaseUrl();
    // let headers = API.getHeaders();
    let headers = {
        Authorization: "Bearer " + "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0cnVuZzEyODk0QGdtYWlsLmNvbSIsImlhdCI6MTcyMzI2MjEwOCwiZXhwIjoxNzIzMzQ4NTA4fQ.AYo9IrfSIjRoo38Ee2Hz_RgKC9ZaT4_oHyaL86DbCl4",
        "X-Refresh-Token": localStorage.getItem("refreshToken"),
    }
    adminBreadcrumbService.generateBreadcrumb()
    // code here

    let account = null; 

    $scope.getUser = async (callback) => {
        try {
            const response = await $http.get(url + "/get-user-by-token", { headers: headers });
            account = response.data;
            callback(account);
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    $scope.urlImgDisplay = () => {
        $scope.getUser((fetchedAccount) => {
            const roleName = fetchedAccount.role.roleName;
            const filename = fetchedAccount.doctor?.image; // Optional chaining for potential doctor absence

            if (!filename) {
                // Handle missing image case (e.g., default image, error message)
                console.warn("Doctor's image filename not found in account data.");
                return; // Or set a default image URL
            }

            let image = url + (roleName === "BAC_SI" ? "/imgDoctor/" : "/imgStaff/") + filename;
            console.log("Generated image URL:", image);
            $scope.srcImage = image;
        });
    };

    // Call the function
    $scope.urlImgDisplay();

    //let role = "BAC_SI"
    // let account = null
    // $scope.srcImage = ""
    // $scope.getUser = async () => {
    //     await $http.get(url + "/get-user-by-token", { headers: headers }).then(response => {
    //         account = response.data
    //     })
    // }

    // $scope.getImg = async () => {
    //     await $scope.getUser()
    //     const roleName = account.role?.roleName;
    //     const filename = account.doctor?.image;
    //     if (!filename) {
    //         return ""
    //     }

    //     let srcImage = url + (roleName === "BAC_SI" ? "/imgDoctor/" : "/imgStaff/") + filename
    //     console.log("srcImage", srcImage);
    //     return srcImage

    // }

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