app.controller('AdminMyProfileController', function ($scope, $http, $rootScope, $location, $timeout, API, $route, adminBreadcrumbService, processSelect2Service) {
    let url = API.getBaseUrl();
    let headers = API.getHeaders();
    adminBreadcrumbService.generateBreadcrumb()
    // code here
    let accountId = API.getUser().split("-")[0]
    let roleName = API.getUser().split("-")[1]
    let email = API.getUser().split("-")[2]
    $scope.account = null
    $scope.filenames = []
    $scope.initDataRequest = () => {
        $scope.formDoctor = {
            image: "",
            doctorId: "",
            fullName: "",
            degrees: "",
            phoneNumber: "",
            gender: "",
            address: "",
            birthday: "",
            signature: "",
            deleted: ""
        }
        $scope.formStaff = {
            fullName: "",
            phoneNumber: "",
            address: "",
            birthday: "",
            imageURL: "",
            gender: "",
            departmentId: ""
        }
    }

    $scope.getAccount = (email) => {
        console.log("eamil", email);
        let param = {
            email: email
        }
        $http.get(url + "/get-user-by-email", { params: param }).then(response => {
            $scope.account = response.data
            console.log("$scope.account", $scope.account);

            if ($scope.account.role.roleName == 'BAC_SI') {
                let doctor = $scope.account.doctor
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
            console.log("$scope.formDoctor bfff", $scope.formDoctor);

        })
    }



    $scope.urlImgDisplay = () => {
        let acc = $scope.account
        if (acc == null) return
        if (acc.role.roleName == "BAC_SI") {
            let filename = acc.doctor.image
            return url + "/imgDoctor/" + filename;
        } else {
            let filename = acc.dentalStaff.imageURL
            return url + "/imgStaff/" + filename;
        }
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
            $scope.filenames.push(...response.data);
        }).catch(err => {
            console.log("error: ", err);
        })
    }

    // $scope.changeImg = () => {
    //     const inputFile = document.getElementById('inputFile')
    //     inputFile.click()
    // }

    // $scope.uploadImg = (files) => {
    //     if (files == null) {
    //         alert("Upload hình chưa thành công")
    //         return
    //     }
    //     var form = new FormData();
    //     for (var i = 0; i < files.length; i++) {
    //         form.append("files", files[i]);
    //     }

    //     $http.post(url + "/saveImage/tempFolder", form, {
    //         transformRequest: angular.identity,
    //         headers: {
    //             'Content-Type': undefined,
    //             ...headers
    //         }
    //     }).then(response => {
    //         $scope.filenames.push(...response.data);
    //         let acc = $scope.account
    //         if (acc.role.roleName == 'BAC_SI') {
    //             $scope.formDoctor.image = $scope.filenames[0]
    //             let requsetDoctorJSON = angular.toJson($scope.formDoctor)
    //             let doctorId = $scope.formDoctor.doctorId
    //             $http.put(url + '/doctor/' + doctorId, requsetDoctorJSON).then(respone => {
    //                 var requsetFileJSON = angular.toJson($scope.filenames)
    //                 $http.post(url + '/move/tempFolder/imgDoctor', requsetFileJSON, {
    //                     transformRequest: angular.identity,
    //                     headers: {
    //                         'Content-Type': undefined,
    //                         ...headers
    //                     }
    //                 }).then(resp => {
    //                     Swal.fire({
    //                         title: "Thành công!",
    //                         html: "Cập nhật thành công!",
    //                         icon: "success"
    //                     }).then(() => {
    //                         $route.reload()
    //                     })
    //                 })
    //             })
    //         }
    //     }).catch(err => {
    //         console.log("error: ", err);
    //     })




    //     // $http.post(url + '/move/tempFolder/imgDoctor', form, {
    //     //     transformRequest: angular.identity,
    //     //     headers: {
    //     //         'Content-Type': undefined,
    //     //         ...headers
    //     //     }
    //     // }).then((response) => {
    //     //     Swal.fire({
    //     //         position:"top-end",
    //     //         title: "Thành công!",
    //     //         html: "Cập nhật thành công!",
    //     //         icon: "success"
    //     //     }).then(()=>{
    //     //         $scope.$apply()
    //     //     })
    //     // })


    // }

    $scope.getAccount(email)
    $scope.initDataRequest()
})