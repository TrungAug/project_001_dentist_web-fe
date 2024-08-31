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
});
