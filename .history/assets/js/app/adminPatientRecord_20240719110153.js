
app.controller('AdminPatientRecord', function ($scope, $http, $rootScope, $location, $timeout, processSelect2Service, TimezoneService, $route) {
    let url = "http://localhost:8081/api/v1/auth"
    let headers = {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
        "X-Refresh-Token": localStorage.getItem("refreshToken"),

    }

    $scope.appointments = []
    $scope.selectPatientIds = []
    $scope.selectDoctorIds=[]
    $scope.selectedDates = ""

    $scope.begin = 0;
    $scope.pageSize = 5;

    $scope.initializeUIComponents = () => {
        $('.select2').select2(
            {
                theme: 'bootstrap4',
                placeholder: 'Select an option',
                allowClear: true
            }
        );

        $('.select2-multi').select2(
            {
                multiple: true,
                theme: 'bootstrap4',
            });

        $('.drgpicker-filter-record').daterangepicker(
            {
                singleDatePicker: false,
                timePicker: false,
                showDropdowns: true,
                locale:
                {
                    format: 'DD/MM/YYYY',
                    applyLabel: 'Áp dụng',
                    cancelLabel: 'Hủy',
                },

            });

        $('.drgpicker-filter-record').on('apply.daterangepicker', function (ev, picker) {
            $scope.selectedDates = $('#dateFilterPatientRecord').val()
            $scope.getAllAppGroupByDate($scope.selectedDates, $scope.selectPatientIds, $scope.selectDoctorIds)
        });

        $('#filterPatient').on('change', function () {
            $timeout(function () {
                let selectedVals = $('#filterPatient').val()
                $scope.selectPatientIds = processSelect2Service.processSelect2Data(selectedVals)
                $scope.getAllAppGroupByDate($scope.selectedDates, $scope.selectPatientIds, $scope.selectDoctorIds)
            });
        });

        $('#filterDoctor').on('change', function () {
            $timeout(function () {
                let selectedVals = $('#filterDoctor').val()
                $scope.selectDoctorIds = processSelect2Service.processSelect2Data(selectedVals)
                $scope.getAllAppGroupByDate($scope.selectedDates, $scope.selectPatientIds, $scope.selectDoctorIds)
            });
        });
    }

    $scope.initData = () => {
        $scope.formPatientRecord = {
            patientId: null,
            doctorId: null,
            dateFilter: moment(new Date()).format("DD/MM/YYYY")
        }
    }

    $scope.getListPatient = () => {
        $http.get(url + '/patient').then(response => {
            $scope.listPatientDB = response.data
           // $scope.listPatientDB = [{ patientId: null, fullName: 'Chọn bệnh nhân' }].concat($scope.listPatientDB);
        })
    }

    $scope.getListDoctor = () => {
        $http.get(url + '/doctor').then(response => {
            $scope.listdoctorDB = response.data
          //  $scope.listdoctorDB = [{ doctorId: null, fullName: 'Chọn bác sĩ' }].concat($scope.listdoctorDB);
        })
    }

    $scope.getAllAppGroupByDate = (selectedDates, selectPatientIds, selectDoctorIds) => {
        let pIds = ""
        let dIds = ""
        if (selectPatientIds.length > 0) {
            pIds = selectPatientIds.join(',')
        }
        if (selectDoctorIds.length > 0) {
            dIds = selectDoctorIds.join(',')
        }
        let params = {
            startDate: selectedDates == "" ? "" : moment(selectedDates.split(' - ')[0], 'DD/MM/YYYY').format('YYYY-MM-DD'),
            endDate: selectedDates == "" ? "" : moment(selectedDates.split(' - ')[1], 'DD/MM/YYYY').format('YYYY-MM-DD'),
            patientIds: pIds,
            doctorIds: dIds
        }
        $http.get(url + '/appointment-group-by-date', { params: params }).then(response => {
            $scope.listAppGroupByDateDB = []
            for (let key in response.data) {
                if (response.data.hasOwnProperty(key)) {
                    if (response.data[key].length > 0) {
                        $scope.listAppGroupByDateDB.push([key, response.data[key]])
                    }
                }
            }
            $scope.listAppGroupByDateDB.sort((a, b) => new Date(b[0]) - new Date(a[0]))
            console.log("$scope.listAppGroupByDateDB", $scope.listAppGroupByDateDB);
            $scope.pageCount = Math.ceil($scope.listAppGroupByDateDB.length / $scope.pageSize);
            $scope.firtPage = function () {
                $scope.begin = 0;
            }
            $scope.prevPage = function () {
                if ($scope.begin > 0) {
                    $scope.begin -= $scope.pageSize;
                }
            }
            $scope.nextPage = function () {
                if ($scope.begin < ($scope.pageCount - 1) * $scope.pageSize) {
                    $scope.begin += $scope.pageSize;
                }
            }
            $scope.lastPage = function () {
                $scope.begin = ($scope.pageCount - 1) * $scope.pageSize
            }
        })
    }

    $scope.reFresh=()=>{
        $scope.selectedDates=""
        $scope.selectPatientIds=[]
        $scope.selectDoctorIds=[]    
        $scope.getAllAppGroupByDate($scope.selectedDates, $scope.selectPatientIds,$scope.selectDoctorIds)
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Đã làm mới dữ liệu !",
            showConfirmButton: false,
            timer: 1500
        });

        $scope.formPatientRecord = {
            patientId: null,
            doctorId: null,
            dateFilter: moment(new Date()).format("DD-MM-YYYY")
        }
    }





    $scope.initializeUIComponents()
    $scope.initData()
    $scope.getListPatient()
    $scope.getListDoctor()
    $scope.getAllAppGroupByDate($scope.selectedDates, $scope.selectPatientIds, $scope.selectDoctorIds)

})

