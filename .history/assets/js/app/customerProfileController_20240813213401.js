app.controller('CustomerProfileController', function ($scope, $http, $rootScope, $location, $timeout, $window, API, $route, adminBreadcrumbService, processSelect2Service) {
    let url = API.getBaseUrl();
    let headers = API.getHeaders();
    let email = API.getUser().split("-")[2]
    $scope.account = null
    $scope.filenames = []
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
            let patient= response.data.patient
            
            console.log(" response.data", response.data);
            
            $scope.formPatient = {
                patientId: patient.patientId,
                fullName: patient.fullName,
                citizenIdentificationNumber: patient.citizenIdentificationNumber,
                phoneNumber: patient.phoneNumber,
                gender: patient.gender,
                imageURL: patient.imageURL,
                birthday: moment(patient.birthday).format('DD/MM/YYYY'),
                deleted: false
            }
            // if ($scope.account.role.roleName == 'BAC_SI') {
            //     let doctor = $scope.account.doctor
            //     $scope.formDoctor = {
            //         image: doctor.image,
            //         doctorId: doctor.doctorId,
            //         fullName: doctor.fullName,
            //         degrees: doctor.degrees,
            //         phoneNumber: doctor.phoneNumber,
            //         gender: doctor.gender,
            //         address: doctor.address,
            //         birthday: new Date(doctor.birthday),
            //         signature: doctor.signature,
            //         deleted: doctor.deleted,
            //         specialtyId: doctor.specialty.specialtyId
            //     }
            // } else {
            //     let dentalStaff = $scope.account.dentalStaff
            //     $scope.formStaff = {
            //         imageURL: dentalStaff.imageURL,
            //         dentalStaffId: dentalStaff.dentalStaffId,
            //         fullName: dentalStaff.fullname,
            //         phoneNumber: dentalStaff.phoneNumber,
            //         gender: dentalStaff.gender,
            //         address: dentalStaff.address,
            //         birthday: new Date(dentalStaff.birthday),
            //         deleted: dentalStaff.deleted,
            //         departmentId: dentalStaff.department.departmentId
            //     }
            // }
        })
    }

    $scope.initData()
    $scope.getAccount("trungnguyen189494@gmail.com")
});
