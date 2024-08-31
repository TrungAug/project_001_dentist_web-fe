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
        let param={
            email:email
        }
        $http.get(url+"/get-user-by-email",{params:param}).then(response=>{
            $scope.account=response.data       
        })
    }
      
    $scope.getAccount(email)

    $scope.urlImgDisplay = () => {
        let acc=$scope.account       
        if(acc==null) return    
        if(acc.role.roleName=="BAC_SI"){
            let filename=acc.doctor.image
            return url + "/imgDoctor/" + filename;
        }else{
            let filename=acc.dentalStaff.imageURL
            return url + "/imgStaff/" + filename;
        }
    }

    $scope.changeImg=()=>{
        const inputFile = document.getElementById('inputFile')
        inputFile.click()    
    }

    $scope.uploadImg = (files) => {
        if (files == null) {
            alert("Upload hình chưa thành công")
            return
        }
        var form = new FormData();
        for (var i = 0; i < files.length; i++) {
            form.append("files", files[i]);
        }
        $http.post(url + "/saveImage/tempFolder", form, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined,
                ...headers
            }
        }).then(response => {
            //$scope.filenames.push(...response.data);
            $http.post(url + '/move/tempFolder/imgDoctor', requsetFileJSON, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined,
                    ...headers
                }
            });
        }).catch(err => {
            console.log("error: ", err);
        })
    }



})