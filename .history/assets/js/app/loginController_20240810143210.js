app.controller('LoginController', function ($scope, $http, $rootScope, $location, $timeout, $window, API, $route, adminBreadcrumbService, processSelect2Service) {
    let url = API.getBaseUrl();
    let headers = API.getHeaders();
    adminBreadcrumbService.generateBreadcrumb();
    // code here
    $scope.isInvalidInput = false;
    $scope.isValidInput = false;

    $scope.initAccountForm = () => {
        $scope.formLogin = {
            email: '',
            password: ''
        }
    }

    $scope.validateEmail = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const email = $scope.formLogin.email;
        let checkEmail = emailPattern.test(email)
        if (checkEmail) {
            $scope.isValidInput = true;
            $scope.isInvalidInput = false;
        } else {
            $scope.isValidInput = false;
            $scope.isInvalidInput = true;
        }
        return checkEmail
    }


    $scope.validateForm = () => {
        let acc = $scope.formLogin
        let valid = false
        let validateEmail = $scope.validateEmail()
        if (acc.email == '') {
            Swal.fire({
                title: "Cảnh báo!",
                html: "Vui lòng nhập email!",
                icon: "error"
            })
        } else if (!validateEmail) {
            Swal.fire({
                title: "Cảnh báo!",
                html: "Email nhập không đúng định dạng!",
                icon: "error"
            })
        } else if (acc.password == '') {
            Swal.fire({
                title: "Cảnh báo!",
                html: "Vui lòng tạo mật khẩu!",
                icon: "error"
            })
        } else {
            valid = true
        }
        return valid
    }

    $scope.login = () => {
        let checkForm = $scope.validateForm()

        if (checkForm) {
            console.log("$scope.formLogin", $scope.formLogin);

        }
        var AuthenticationRequest = angular.toJson($scope.formLogin)
        $http.post(url + '/authenticate', AuthenticationRequest).then(respone => {
            console.log("$scope.formLogin", respone.data);
            localStorage.setItem('accessToken', respone.data.access_token)
            localStorage.setItem('refreshToken', respone.data.refresh_token)
            let userString =respone.data.user.id+'-'+respone.data.user.role.roleName
            localStorage.setItem('userLogin', respone.data.user)
            // $window.location.href = '/';
        });
    }

    $scope.initAccountForm()
})