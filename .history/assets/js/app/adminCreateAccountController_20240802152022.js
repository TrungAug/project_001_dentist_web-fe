app.controller('AdminCreateAccountController', function ($scope, $http, $rootScope, $location, $timeout, API, $route, adminBreadcrumbService, processSelect2Service) {
    let url = API.getBaseUrl();
    let headers = API.getHeaders();
    adminBreadcrumbService.generateBreadcrumb()
    // code here
    $scope.dataObject = []
    $scope.selectedOption = ''
    // $scope.dataOptions = [
    //     {
    //         id: 1,
    //         name: 'Bệnh nhân'
    //     },
    //     {
    //         id: 2,
    //         name: 'Bác sĩ'
    //     },
    //     {
    //         id: 3,
    //         name: 'Nhân viên'
    //     },
    // ]
    $scope.accForm = {
        email: '',
        password: '',
        role: '',
        dentalStaffId: '',
        patientId: '',
        doctorId: ''
    }

    $scope.getRoleOption = async (option) => {
        $scope.accForm.role = option.roleId
        let op = option.roleName
        switch (op) {
            case 'BENH_NHAN':
                await $http.get(url + '/patient-except-deleted').then(response => {
                    $scope.dataObject = response.data
                    $scope.selectedOption = 'BENH_NHAN'
                })

                break
            case 'BAC_SI':
                await $http.get(url + '/doctor-except-deleted').then(response => {
                    $scope.dataObject = response.data
                    $scope.selectedOption = 'BAC_SI'
                })

                break
            case 'NHAN_VIEN':
            case 'ADMIN':
            case 'LE_TAN':
                await $http.get(url + '/dental-staff-except-deleted').then(response => {
                    $scope.dataObject = response.data
                    $scope.selectedOption = 'NHAN_VIEN'
                })
                break
            default:
                $scope.selectedOption = ''
                console.log("ID tùy chọn không hợp lệ:", op);
                break
        }
        $scope.initializeUIComponents(option)
    }

    $scope.initializeUIComponents = (option) => {
        let op = option.roleName
        if (op === 'ADMIN' || op === 'LE_TAN') {
            op = 'NHAN_VIEN'
        }

        $('.select2').select2(
            {
                theme: 'bootstrap4',
                placeholder: 'Select an option',
                allowClear: true
            });

        $('#selectedOption' + op).on('change', function () {
            $timeout(function () {
                let selectedVal = $('#selectedOption' + op).val()
                if (op === 'BENH_NHAN') {
                    $scope.accForm.patientId = processSelect2Service.processSelect2Data(selectedVal)[0]
                } else if (op === 'BAC_SI') {
                    $scope.accForm.doctorId = processSelect2Service.processSelect2Data(selectedVal)[0]
                } else {
                    $scope.accForm.dentalStaffId = processSelect2Service.processSelect2Data(selectedVal)[0]
                }
            });
        });
    }

    $scope.getRole = () => {
        $http.get(url + '/role-except-deleted').then(response => {
            $scope.listRoleDB = response.data
        })
    }

    $scope.generatePassword = ($event) => {
        $event.preventDefault();
        $scope.accForm.password = 'abc'

        var passwordLength = 8
        var chkIncludeLowerChar = ["a","b","c","d","e","f","g","h","j","k","m","n","p","q","r","s","t","u","v","w","x","y","z"]
        var chkIncludeUpperChar = ["A","B","C","D","E","F","G","H","J","K","M","N","P","Q","R","S","T","U","V","W","X","Y","Z"];
        var chkIncludeNumbers = ["2","3","4","5","6","7","8","9"]
        var chkIncludeSymbols = ["!","#","$","%","&","*","+","-","?","@"]
        var chkExcludeSimilar = document.getElementById('chkExcludeSimilar').checked;
        var chkExcludeAmbiguous = ["\"","'","(",")",",",".","/",":",";","<","=",">","[","\\","]","^","_","`","{","}","~"]
    }

    $scope.getRole()

})