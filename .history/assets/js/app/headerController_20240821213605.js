app.controller('HeaderController', function ($scope, $http, $rootScope, SocketService, $location, $timeout, $window, API, $route, adminBreadcrumbService, processSelect2Service) {
    let url = API.getBaseUrl();
    let headers = API.getHeaders();
    $scope.isLogin = localStorage.getItem("isLogin") ? localStorage.getItem("isLogin") : false;
    $scope.roleName = API.getUser()?API.getUser().split("-")[1]:null
    SocketService.getStompClient().then(function (stompClient) {
        // stompClient is ready and subscriptions are set
    }).catch(function (error) {
        console.error('Connection error in controller: ' + error);
    });
    $scope.logout = () => {
        $http.post(url + '/logout', {}, { headers: headers })
            .then(function (response) {
                localStorage.removeItem("isLogin");
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("userLogin");
                $location.path('/login');
                $scope.isLogin = false;
                 $rootScope.$apply();
            })
            .catch(function (error) {
                console.error("Logout failed", error);
            });
    }
});
