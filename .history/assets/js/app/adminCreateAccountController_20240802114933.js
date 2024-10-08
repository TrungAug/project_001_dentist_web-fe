app.controller('AdminCreateAccountController', function ($scope, $http, $rootScope, $location, $timeout, API, $route, adminBreadcrumbService) {
    let url = API.getBaseUrl();
    let headers = API.getHeaders();
    adminBreadcrumbService.generateBreadcrumb()
    // code here
    $scope.dataObject=[]
    $scope.dataOptions = [
        {
            id: 1,
            name: 'Bệnh nhân'
        },
        {
            id: 2,
            name: 'Bác sĩ'
        },
        {
            id: 3,
            name: 'Nhân viên'
        },
    ]

    $scope.getOption = (option) => {
        let op = option.id
        console.log("op",op);
        switch (op) {
            case 1:
                $http.get(url + '/patient-except-deleted').then(response => {
                    $scope.dataObject = response.data
                    $scope.dataObject.unshift({ patientId: null, fullName: 'Chọn tất cả' });
                })
                break
            case 2:
                $http.get(url + '/doctor-except-deleted').then(response => {
                    $scope.dataObject = response.data
                    $scope.dataObject.unshift({ doctorId: null, fullName: 'Chọn tất cả' });
                })
                break
            case 3:
                $http.get(url + '/dental-staff-except-deleted').then(response => {
                    $scope.dataObject = response.data
                    $scope.dataObject.unshift({ dentalStaffId: null, fullname: 'Chọn tất cả' });
                })
                break
            default:
                console.log("ID tùy chọn không hợp lệ:", op);
                break
        }

        console.log(" $scope.dataObject",  $scope.dataObject);
    }


})