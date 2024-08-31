app.controller('CustomerProfileController', function ($scope, $http, $rootScope, $location, $timeout, $window, API, $route, adminBreadcrumbService, processSelect2Service) {
    let url = API.getBaseUrl();
    let headers = API.getHeaders();
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
        $scope.formPatient = {
            imageURL: "",
            patientId: parseInt(API.getUser().split("-")[0]),
            fullName: "",
            phoneNumber: "",
            gender: "",
            address: "",
            birthday: "",
            deleted: "",
            citizenIdentificationNumber: ""
        }

        $scope.formChangePassword = {
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        }

        $scope.listGenderTypeDB = [
            { genderId: 'MALE', genderName: 'Nam' },
            { genderId: 'FEMALE', genderName: 'Nữ' },
            { genderId: 'UNISEX', genderName: 'Khác' }
        ];

        $scope.initializeUIComponents()
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
                maxDate: moment().format('DD/MM/YYYY'),
                locale:
                {
                    format: 'DD/MM/YYYY',
                    applyLabel: 'Áp dụng',
                    cancelLabel: 'Hủy',
                },
            });

        $('.drgpicker').on('apply.daterangepicker', function (ev, picker) {
            let selectedDate = picker.startDate.format('DD/MM/YYYY');
            $scope.formPatient.birthday = selectedDate   
        });

        $('#customerGender').on('change', function () {
            $timeout(function () {
                let selectedVals = $('#customerGender').val();
                $scope.formPatient.gender = selectedVals.split(":")[1]
            });
        });
    }

    $scope.getAccount = (email) => {
        let param = {
            email: email
        }
        $http.get(url + "/get-user-by-email", { params: param }).then(response => {
            $scope.account = response.data
            let patient = response.data.patient

            console.log(" response.data", response.data);

            $scope.formPatient = {
                patientId: patient.patientId,
                fullName: patient.fullName,
                citizenIdentificationNumber: patient.citizenIdentificationNumber,
                phoneNumber: patient.phoneNumber,
                gender: patient.gender,
                imageURL: patient.imageURL,
                birthday: moment(patient.birthday).format('DD/MM/YYYY'),
                deleted: patient.deleted
            }
        })
    }

    $scope.urlImgDisplay = () => {
        let acc = $scope.account
        if (acc == null) return
        return url + "/imgPatient/" + filename;
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

    $scope.initData()
    $scope.getAccount("trungnguyen189494@gmail.com")
});
