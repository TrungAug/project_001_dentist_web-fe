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
    
    $scope.initDataRequest = ()=>{
        $scope.getAccount()
        let acc=$scope.account
        console.log("Acc kaka",acc);
        
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

        let acc=$scope.account 
        if(acc.role.roleName=='BAC_SI'){
            $scope.formDoctor = {
                image: doctor.image,
                doctorId: doctor.doctorId,
                fullName: doctor.fullName,
                degrees: doctor.degrees,
                phoneNumber: doctor.phoneNumber,
                gender: doctor.gender,
                address: doctor.address,
                birthday: new Date(doctor.birthday),
                signature: doctor.signature,
                deleted: doctor.deleted
            }
        }
        console.log("acc",acc);
        console.log("files",files);
        
        

        // $http.post(url + '/move/tempFolder/imgDoctor', form, {
        //     transformRequest: angular.identity,
        //     headers: {
        //         'Content-Type': undefined,
        //         ...headers
        //     }
        // }).then((response) => {
        //     Swal.fire({
        //         position:"top-end",
        //         title: "Thành công!",
        //         html: "Cập nhật thành công!",
        //         icon: "success"
        //     }).then(()=>{
        //         $scope.$apply()
        //     })
        // })

        // $http.post(url + "/saveImage/tempFolder", form, {
        //     transformRequest: angular.identity,
        //     headers: {
        //         'Content-Type': undefined,
        //         ...headers
        //     }
        // }).then(response => {
        //     $scope.filenames.push(...response.data);      
        // }).catch(err => {
        //     console.log("error: ", err);
        // })
    }



})