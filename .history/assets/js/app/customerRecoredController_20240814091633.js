app.controller('CustomerRecoredController', function ($scope, $http, $rootScope, $location, $timeout, $window, API, $route, adminBreadcrumbService, processSelect2Service) {
    let url = API.getBaseUrl();
    let headers = API.getHeaders();


    $scope.initData = () => {
        $scope.selectedDates = ""
        $scope.selectPatientIds = []
        $scope.selectDoctorIds = []
        $scope.formPatientRecord = {
            doctorId: null,
            dateFilter: moment(new Date()).format("DD/MM/YYYY")
        }
        $scope.initializeUIComponents()
    }

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

        $('.customer-drgpicker-filter-record').daterangepicker(
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

        $('.customer-drgpicker-filter-record').on('apply.daterangepicker', function (ev, picker) {
            $scope.selectedDates = $('#customerFilterByDate').val()
            $scope.getAllAppGroupByDate($scope.selectedDates, $scope.selectPatientIds, $scope.selectDoctorIds)
        });


        $('#customerFilterDoctor').on('change', function () {
            $timeout(function () {
                let selectedVals = $('#customerFilterDoctor').val()
                $scope.selectDoctorIds = processSelect2Service.processSelect2Data(selectedVals)
                $scope.getAllAppGroupByDate($scope.selectedDates, $scope.selectPatientIds, $scope.selectDoctorIds)
            });
        });
    }

    $scope.reFresh = () => {
        $scope.selectedDates = ""
        $scope.selectPatientIds = []
        $scope.selectDoctorIds = []
        $scope.formPatientRecord = {
            doctorId: null,
            dateFilter: moment(new Date()).format("DD/MM/YYYY")
        }
        $('#filterDoctor').val(null).trigger('change');
        $('#filterPatient').val(null).trigger('change');
        $scope.getAllAppGroupByDate($scope.selectedDates, $scope.selectPatientIds, $scope.selectDoctorIds)
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Đã làm mới dữ liệu !",
            showConfirmButton: false,
            timer: 1500
        });
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
            console.log("response", response.data);
            for (let key in response.data) {
                if (response.data.hasOwnProperty(key)) {
                    if (response.data[key].length > 0) {
                        $scope.listAppGroupByDateDB.push([key, response.data[key]])
                    }
                }
            }
            $scope.listAppGroupByDateDB.sort((a, b) => new Date(b[0]) - new Date(a[0]))
            console.log("$scope.listAppGroupByDateDB", $scope.listAppGroupByDateDB);
            if ($.fn.DataTable.isDataTable('#dataTable-customer-recorded')) {
                $('#dataTable-customer-recorded').DataTable().clear().destroy();
            }
            $(document).ready(function () {
                $('#dataTable-customer-recorded').DataTable({
                    autoWidth: true,
                    "lengthMenu": [
                        [10, 20, 30, -1],
                        [10, 20, 30, "All"]
                    ],
                    language: {
                        sProcessing: "Đang xử lý...",
                        sLengthMenu: "Hiển thị _MENU_ mục",
                        sZeroRecords: "Không tìm thấy dòng nào phù hợp",
                        sInfo: "Đang hiển thị _START_ đến _END_ trong tổng số _TOTAL_ mục",
                        sInfoEmpty: "Đang hiển thị 0 đến 0 trong tổng số 0 mục",
                        sInfoFiltered: "(được lọc từ _MAX_ mục)",
                        sInfoPostFix: "",
                        sSearch: "Tìm kiếm:",
                        sUrl: "",
                        oPaginate: {
                            sFirst: "Đầu",
                            sPrevious: "Trước",
                            sNext: "Tiếp",
                            sLast: "Cuối"
                        }
                    },
                    "ordering": false
                });
            });

        })
    }

    $scope.getListDoctor = () => {
        $http.get(url + '/doctor').then(response => {
            $scope.listdoctorDB = response.data

        })
    }

    $scope.setupTab = (appointmentId) => {
        $scope.currentTab = -1 + '-' + appointmentId;

        $scope.selectTab = (tab, $event) => {
            $event.preventDefault()
            $scope.currentTab = tab + '-' + appointmentId
        }
        $scope.isSelected = (tab) => {
            return $scope.currentTab === tab + '-' + appointmentId
        }
    }

    $scope.getDetailsAppointment = (appointmentId) => {
        let duData = $scope.listDoctorUnavailabilityAllDoctorDB.filter(du => du.appointment.appointmentId === appointmentId)
        return duData
    };


    $scope.processDoctorUnavailabilityAllDoctor = () => {
        return new Promise((resolve, reject) => {
            $http.get(url + '/doctorUnavailability', { headers: headers }).then((response) => {
                let filteredData = response.data;

                if ($scope.selectedDoctorLApp.length > 0) {
                    filteredData = filteredData.filter(item => {
                        return $scope.selectedDoctorLApp.includes(item.appointment.doctor.doctorId);
                    });
                }
                if ($scope.selectedDatesLApp.length > 0) {
                    filteredData = filteredData.filter(item => {
                        return $scope.selectedDatesLApp.includes(moment(item.date).format("YYYY-MM-DD"));
                    });
                }

                if ($scope.selectedPatientLApp.length > 0) {
                    filteredData = filteredData.filter(item => {
                        return $scope.selectedPatientLApp.includes(item.appointment.patient.patientId);
                    });
                }

                if ($scope.isReExaminationFilter) {
                    filteredData = filteredData.filter(item => {
                        return item.appointment.appointmentPatientRecord.reExamination != ""
                    });

                    filteredData.sort((a, b) => {
                        let dateStrA = a.appointment.appointmentPatientRecord.reExamination
                        let dateStrB = b.appointment.appointmentPatientRecord.reExamination
                        let dateA = moment(dateStrA, "DD/MM/YYYY").toDate();
                        let dateB = moment(dateStrB, "DD/MM/YYYY").toDate();
                        return dateB - dateA
                    })

                }

                let checkStatus = ['đã hủy', 'không đến', 'hoãn']
                filteredData = filteredData.filter(du => {
                    let stt = du.appointment.appointmentStatus
                    let isAuth = checkStatus.includes(stt ? du.appointment.appointmentStatus.status.toLowerCase() : 'đã xác nhận')
                    return (du.deleted == false) || (du.deleted == true && isAuth)
                })


                resolve(filteredData)
            }).catch((error) => reject(error))
        })
    }

    $scope.getListDoctorUnavailabilityAllDoctor = () => {
        $scope.processDoctorUnavailabilityAllDoctor().then(result => {
            $scope.listDoctorUnavailabilityAllDoctorDB = result
            $scope.listAppointmentDBFromDu = []
            let seenAppointmentIds = {}
            result.forEach(rs => {
                if (!seenAppointmentIds[rs.appointment.appointmentId]) {
                    seenAppointmentIds[rs.appointment.appointmentId] = true;
                    $scope.listAppointmentDBFromDu.push(rs.appointment);
                }
            })
        })
    }

    $scope.initData()
    $scope.getListDoctor()
    $scope.getAllAppGroupByDate($scope.selectedDates, $scope.selectPatientIds, $scope.selectDoctorIds)
    $scope.getListDoctorUnavailabilityAllDoctor()
});
