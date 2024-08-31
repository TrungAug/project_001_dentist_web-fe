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
            $http.put(url + '/doctor/' + doctorId, requsetDoctorJSON).then(respone => {
                var requsetFileJSON = angular.toJson($scope.filenames[0])
                $http.post(url + '/move/tempFolder/imgDoctor', requsetFileJSON, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined,
                        ...headers
                    }
                }).then(resp => {
                    Swal.fire({
                        title: "Thành công!",
                        html: "Cập nhật thành công!",
                        icon: "success"
                    }).then(() => {
                        $route.reload()
                    })
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
            $http.put(url + '/dental-staff/' + staffId, requestStaffJSON).then(response => {
                var requsetFileJSON = angular.toJson($scope.filenames[0])
                $http.post(url + '/move/tempFolder/imgStaff', requsetFileJSON, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined,
                        ...headers
                    }
                }).then(resp => {
                    Swal.fire({
                        title: "Thành công!",
                        html: "Cập nhật thành công!",
                        icon: "success"
                    }).then(() => {
                        $route.reload()
                    })
                })
            })
        }
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