
app.controller('AdminPatientRecord', function ($scope, $http, $rootScope, $location, $timeout, processSelect2Service, TimezoneService, $route) {
    let url = "http://localhost:8081/api/v1/auth"
    let headers = {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
        "X-Refresh-Token": localStorage.getItem("refreshToken"),

    }
    //code here
    $scope.initializeUIComponents = (){
        $('.select2').select2(
            {
                theme: 'bootstrap4',
                placeholder: 'Select an option',
                allowClear: true
            }
        );

        $('#filterCustomer').on('change', function () {
            $timeout(function () {
                $scope.formPatientRecord.filerPatient = $('#filterCustomer').val();
            });
        });
    }
    $scope.getListPatient = () => {
        $http.get(url).then(response => {
            $scope.listPatientDB = response.data
        })
    }

})

