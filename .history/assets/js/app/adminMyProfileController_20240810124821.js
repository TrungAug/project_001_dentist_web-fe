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
   


    // $scope.urlImgDisplay = () => {
        
    //     (async () => {
    //         let image=""
    //         try {
    //             await $scope.getUser()
    //             let roleName = account.role.roleName
    //             let filename = account.doctor.image     
    //             image = url + "/imgStaff/" + filename; 
    //             if (roleName == "BAC_SI") {
    //                 image = url + "/imgDoctor/" + filename
    //             }
    //         } catch (error) {
    //             console.error("Error retrieving user:", error);
    //         }
    //     })()
       
    //     return image
    // }
    // $scope.srcImage=$scope.urlImgDisplay()
    // console.log("$scope.srcImage",$scope.srcImage);
    $scope.urlImgDisplay = async () => {
        try {
          await $scope.getUser();   
          const roleName = account.role.roleName;
          const filename = account.doctor?.image; 
          if (!filename) {        
            return ""
          }
          let image = url + (roleName === "BAC_SI" ? "/imgDoctor/" : "/imgStaff/") + filename
          return image;
        } catch (error) {
          console.error("Error retrieving user:", error)
          return ""
        }
      };
      
      $scope.srcImage =$scope.urlImgDisplay(); // Use async/await for clarity
      console.log("$scope.srcImage:", $scope.srcImage);
    
})