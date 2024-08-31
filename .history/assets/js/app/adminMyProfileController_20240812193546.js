app.controller('AdminMyProfileController', function ($scope, $http, $rootScope, $location, $timeout, API, $route, adminBreadcrumbService, processSelect2Service) {
    let url = API.getBaseUrl();
    let headers = API.getHeaders();
    adminBreadcrumbService.generateBreadcrumb()
    // code here
    let accountId = API.getUser().split("-")[0]
    $scope.isDoctor = API.getUser().split("-")[1] === 'BAC_SI'
    let email = API.getUser().split("-")[2]
    $scope.account = null
    $scope.filenames = []

    $scope.initData = () => {
        $scope.isShowCurrentPassword = false
        $scope.isShowNewPassword = false
        $scope.isShowConfirmPassword = false
        $scope.isPatternPassword = false
        $scope.isFocusNewPassword = false
        $scope.isFocusCurrentPassword = false
        $scope.isFocusConfirmPassword = false
        $scope.isSamePreviousPasswordNewInput = false
        $scope.isSamePreviousPasswordCurrentInput = false
        $scope.isMatchNewPassword = false
        $scope.isLoadingChangePassword = false
        $scope.isLoadingUpdateInfo = false
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
            deleted: "",
            specialtyId: ""
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

        $scope.formChangePassword = {
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        }

        $scope.listDegreesTypeDB = [
            { degreesId: 1, degreesName: 'Thạc sĩ' },
            { degreesId: 2, degreesName: 'Tiến sĩ' },
            { degreesId: 3, degreesName: 'Bác sĩ' },
            { degreesId: 4, degreesName: 'Giáo sư' },
            { degreesId: 5, degreesName: 'Y tá' },
            { degreesId: 6, degreesName: 'Y sĩ' },

        ];

        $scope.listGenderTypeDB = [
            { genderId: 'MALE', genderName: 'Nam' },
            { genderId: 'FEMALE', genderName: 'Nữ' },
            { genderId: 'UNISEX', genderName: 'Khác' }
        ];
        $scope.getListSpecialtyType()
        $scope.getListDepartments()
        $scope.initializeUIComponents()
    }

    $scope.getListSpecialtyType = () => {
        $http.get(url + "/specialty").then(response => {
            $scope.listSpecialtyTypeDB = response.data
        }).catch(err => {
            Swal.fire({
                title: "Thất bại!",
                html: '<p class="text-danger">Xảy ra lỗi!</p>',
                icon: "error"
            })
        })
    }

    $scope.getListDepartments = () => {
        $http.get(url + '/department').then(response => {
            $scope.listDepartmentDB = response.data
        }).catch(error => {
            console.log("Error", error);
        })
    }

    $scope.getAccount = (email) => {
        let param = {
            email: email
        }
        $http.get(url + "/get-user-by-email", { params: param }).then(response => {
            $scope.account = response.data
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
                    deleted: doctor.deleted,
                    specialtyId: doctor.specialty.specialtyId
                }
            } else {
                let dentalStaff = $scope.account.dentalStaff
                $scope.formStaff = {
                    imageURL: dentalStaff.imageURL,
                    dentalStaffId: dentalStaff.dentalStaffId,
                    fullName: dentalStaff.fullname,
                    phoneNumber: dentalStaff.phoneNumber,
                    gender: dentalStaff.gender,
                    address: dentalStaff.address,
                    birthday: new Date(dentalStaff.birthday),
                    deleted: dentalStaff.deleted,
                    departmentId: dentalStaff.department.departmentId
                }
            }
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

    $scope.urlImg = (filename) => {
        let image = url + "/image/tempFolder/" + filename
        return image
    }

    $scope.checkAge = (dateOfBirth) => {
        if (!dateOfBirth) return false;
        var currentDate = new Date();
        var birthDate = new Date(dateOfBirth);
        var age = currentDate.getFullYear() - birthDate.getFullYear();
        if (currentDate.getMonth() < birthDate.getMonth() ||
            (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate())) {
            age--;
        }
        return age >= 18;
    }

    $scope.validateBirthday = () => {
        return $scope.isDoctor ? $scope.checkAge($scope.formDoctor.birthday) : $scope.checkAge($scope.formStaff.birthday)
    }

    $scope.$watch('formDoctor.birthday', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.validateBirthday();
        }
    })

    $scope.$watch('formStaff.birthday', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.validateBirthday();
        }
    })

    $scope.validationForm = () => {
        $scope.isDoctor
        var valid = false
        if ($scope.isDoctor) {
            if ($scope.formDoctor.degrees == "" || $scope.formDoctor.degrees == null) {
                Swal.fire({
                    title: "Cảnh báo!",
                    html: "Vui lòng chọn bằng cấp!",
                    icon: "error"
                })
            } else if ($scope.formDoctor.specialtyId == "" || $scope.formDoctor.specialtyId == null) {
                Swal.fire({
                    title: "Cảnh báo!",
                    html: "Vui lòng chọn chuyên khoa!",
                    icon: "error"
                })
            } else if ($scope.formDoctor.gender == "" || $scope.formDoctor.gender == null) {
                Swal.fire({
                    title: "Cảnh báo!",
                    html: "Vui lòng chọn giới tính!",
                    icon: "error"
                })
            } else if ($scope.formDoctor.fullName == "" || $scope.formDoctor.fullName == null) {
                Swal.fire({
                    title: "Cảnh báo!",
                    html: "Vui lòng nhập họ tên!",
                    icon: "error"
                })
            } else if (!$scope.validateBirthday()) {
                Swal.fire({
                    title: "Cảnh báo!",
                    html: "Ngày sinh phải đủ 18 tuổi!",
                    icon: "error"
                })
            } else if ($scope.formDoctor.phoneNumber == "") {
                Swal.fire({
                    title: "Cảnh báo!",
                    html: "Vui lòng nhập số điện thoại!",
                    icon: "error"
                })
            } else if ($scope.formDoctor.address == "") {
                Swal.fire({
                    title: "Cảnh báo!",
                    html: "Vui lòng nhập địa chỉ!",
                    icon: "error"
                })
            } else {
                valid = true
            }
        } else {
            if ($scope.formStaff.departmentId == "" || $scope.formStaff.departmentId == null) {
                Swal.fire({
                    title: "Cảnh báo!",
                    html: "Vui lòng chọn phòng ban!",
                    icon: "error"
                })
            } else if ($scope.formStaff.gender == "" || $scope.formStaff.gender == null) {
                Swal.fire({
                    title: "Cảnh báo!",
                    html: "Vui lòng chọn giới tính!",
                    icon: "error"
                })
            } else if ($scope.formStaff.fullName == "" || $scope.formStaff.fullName == null) {
                Swal.fire({
                    title: "Cảnh báo!",
                    html: "Vui lòng nhập họ tên!",
                    icon: "error"
                })
            } else if (!$scope.validateBirthday()) {
                Swal.fire({
                    title: "Cảnh báo!",
                    html: "Ngày sinh phải đủ 18 tuổi!",
                    icon: "error"
                })
            } else if ($scope.formStaff.phoneNumber == "") {
                Swal.fire({
                    title: "Cảnh báo!",
                    html: "Vui lòng nhập số điện thoại!",
                    icon: "error"
                })
            } else if ($scope.formStaff.address == "") {
                Swal.fire({
                    title: "Cảnh báo!",
                    html: "Vui lòng nhập địa chỉ!",
                    icon: "error"
                })
            } else {
                valid = true
            }
        }
        return valid
    }

    $scope.updateDoctor = () => {
        if ($scope.filenames[0] == null) {
            $scope.formDoctor.image = $scope.account.doctor.image
        } else {
            $scope.formDoctor.image = $scope.filenames[0]
        }
        let requsetDoctorJSON = angular.toJson($scope.formDoctor)
        let doctorId = $scope.formDoctor.doctorId
        var valid = $scope.validationForm()
        if (valid) {
            $scope.isLoadingUpdateInfo=true
            $http.put(url + '/doctor/' + doctorId, requsetDoctorJSON).then(respone => {
                var requsetFileJSON = angular.toJson($scope.filenames[0])
                $http.post(url + '/move/tempFolder/imgDoctor', requsetFileJSON, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined,
                        ...headers
                    }
                }).then(resp => {        
                    $timeout(() => {
                        $scope.isLoadingUpdateInfo=false
                    },3000)                         
                }).finally(() => {
                    $timeout(() => {
                        Swal.fire({
                            title: "Thành công!",
                            html: "Cập nhật thành công!",
                            icon: "success"
                        }).then(() => {
                            $scope.$apply()
                        })
                    },3000)             
                })
            })
        }

    }

    $scope.updateStaff = () => {
        if ($scope.filenames[0] == null) {
            $scope.formStaff.imageURL = $scope.account.dentalStaff.imageURL
        } else {
            $scope.formStaff.imageURL = $scope.filenames[0]
        }
        let requestStaffJSON = angular.toJson($scope.formStaff)
        let staffId = $scope.formStaff.dentalStaffId
        var valid = $scope.validationForm()
        if (valid) {
            $scope.isLoadingUpdateInfo=true
            $http.put(url + '/dental-staff/' + staffId, requestStaffJSON).then(response => {
                var requsetFileJSON = angular.toJson($scope.filenames[0])
                $http.post(url + '/move/tempFolder/imgStaff', requsetFileJSON, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined,
                        ...headers
                    }
                }).then(resp => {
                    $timeout(() => {
                        $scope.isLoadingUpdateInfo=false
                    },3000)              
                }).finally(() =>{
                    $timeout(() => {
                        Swal.fire({
                            title: "Thành công!",
                            html: "Cập nhật thành công!",
                            icon: "success"
                        }).then(() => {
                            $scope.$apply()
                        })
                    },3000) 
                })
            })
        }
    }

    $scope.togglePassword = (field) => {
        if (field === 'current') {
            $scope.isShowCurrentPassword = !$scope.isShowCurrentPassword;
            var input = document.getElementById('currentPassword');
            input.type = $scope.isShowCurrentPassword ? 'text' : 'password';
        } else if (field === 'new') {
            $scope.isShowNewPassword = !$scope.isShowNewPassword;
            var input = document.getElementById('newPassword');
            input.type = $scope.isShowNewPassword ? 'text' : 'password';
        } else if (field === 'confirm') {
            $scope.isShowConfirmPassword = !$scope.isShowConfirmPassword;
            var input = document.getElementById('confirmPassword');
            input.type = $scope.isShowConfirmPassword ? 'text' : 'password';
        }
    }

    $scope.checkNewPasswordInput = (password) => {
        if (password == undefined) {
            $scope.isFocusNewPassword = false
            return
        }
        $scope.isFocusNewPassword = true
        const passwordPattern = /^[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;"'<>,.?\/|`~-]{8,250}$/;
        $scope.isPatternPassword = passwordPattern.test(password);
        $scope.checkSamePreviousPassword(password, "New")

        if ($scope.formChangePassword.confirmPassword != "") {
            $scope.checkConfirmPasswordInput($scope.formChangePassword.confirmPassword)
        }
    }

    $scope.checkCurrentPasswordInput = (inpPassword) => {
        if (inpPassword == undefined) {
            $scope.isFocusCurrentPassword = false
            return
        }
        $scope.isFocusCurrentPassword = true
        $scope.checkSamePreviousPassword(inpPassword, "Current")
    }

    $scope.checkSamePreviousPassword = (inpPassword, field) => {
        if (inpPassword == undefined) return
        let passwordMap = {
            newPassword: inpPassword,
            currentPassword: $scope.account.password
        }
        let dataJson = angular.toJson(passwordMap)
        $http.post(url + '/valid-password', dataJson, { headers: headers }).then(response => {
            if (field === 'Current') {
                $scope.isSamePreviousPasswordCurrentInput = response.data
            } else if (field === 'New') {
                $scope.isSamePreviousPasswordNewInput = response.data
            }
        })

    }

    $scope.checkConfirmPasswordInput = (inpPassword) => {
        if (inpPassword == undefined) {
            $scope.isFocusConfirmPassword = false
            return
        }
        $scope.isFocusConfirmPassword = true
        $scope.isMatchNewPassword = $scope.formChangePassword.newPassword === inpPassword;
    }

    $scope.validFormPassword = () => {
        let validCurrentPassword = !$scope.isSamePreviousPasswordCurrentInput
        let validNewPassword = !$scope.isPatternPassword && $scope.isSamePreviousPasswordNewInput
        let validConfirmPassword = !$scope.isMatchNewPassword
        let inValid = validCurrentPassword || validNewPassword || validConfirmPassword
        return !inValid
    }

    $scope.changePassword = () => {
        let valid = $scope.validFormPassword()
        if (!valid) return
       
        let updatePasswordRequest = {
            email: email,
            password: $scope.formChangePassword.newPassword
        }

        let mailInfo = {
            from: 'trung2894@gmail.com',
            to: email,
            subject: 'Thống báo đổi mật khẩu',
            body: '<p>Chúc mừng bạn đã đổi mật khẩu thành công.</p> <p>Mật khẩu của bạn là: ' + '<bold>' + $scope.formChangePassword.newPassword + '</bold>' + '</p>'
        }
        $scope.isLoadingChangePassword=true
        let updateRequest = $http.post(url + '/update-password', updatePasswordRequest)
        let emailRequest = $http.post(url + '/send-account-info', mailInfo)
        Promise.all([updateRequest, emailRequest]).then(() => {           
            $scope.isLoadingChangePassword=false
            $scope.$apply()
        }).finally(()=>{
            Swal.fire({
                title: "Thành công!",
                text: "Thay đổi mật khẩu thành công. Bạn có muốn đăng nhập lại?",
                icon: "success",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Đồng ý",
                cancelButtonText: "Ở lại",        
            }).then((result) => {
                if (result.isConfirmed) {
                    $location.path('/login');
                    $scope.$apply();
                } else {
                    $scope.formChangePassword = {
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: ""
                    };
                    $scope.$apply(); 
                }
            });
        })


    }

    $scope.initializeUIComponents = () => {
        $('.select2').select2(
            {
                theme: 'bootstrap4',
            });
        $('.drgpicker').daterangepicker(
            {
                singleDatePicker: true,
                timePicker: false,
                showDropdowns: true,
                locale:
                {
                    format: 'DD/MM/YYYY'
                }
            });

        $('#degreesId').on('change', function () {
            $timeout(function () {
                let selectedVals = $('#degreesId').val();
                $scope.formDoctor.degrees = processSelect2Service.processSelect2Data(selectedVals)[0]
            });
        });
        $('#specialtyId').on('change', function () {
            $timeout(function () {
                let selectedVals = $('#specialtyId').val();
                $scope.formDoctor.specialtyId = processSelect2Service.processSelect2Data(selectedVals)[0]
            });
        });
        $('#doctorGender').on('change', function () {
            $timeout(function () {
                let selectedVals = $('#doctorGender').val();
                $scope.formDoctor.gender = selectedVals.split(":")[1]
            });
        });
        $('#staffGender').on('change', function () {
            $timeout(function () {
                let selectedVals = $('#staffGender').val();
                $scope.formStaff.gender = selectedVals.split(":")[1]
            });
        });
        $('#departmentId').on('change', function () {
            $timeout(function () {
                let selectedVals = $('#departmentId').val();
                $scope.formDoctor.departmentId = processSelect2Service.processSelect2Data(selectedVals)[0]
            });
        });
    }

    $scope.getAccount(email)
    $scope.initData()

})