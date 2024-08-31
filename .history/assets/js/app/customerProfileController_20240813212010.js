app.controller('CustomerProfileController', function ($scope, $http, $rootScope, $location, $timeout, $window, API, $route, adminBreadcrumbService, processSelect2Service) {
    let url = API.getBaseUrl();
    let headers = API.getHeaders();
    $scope.initData = () => {
        $scope.filenames = []
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

});
