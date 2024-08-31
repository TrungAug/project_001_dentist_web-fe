app.controller('CustomerRecoredController', function ($scope, $http, $rootScope, $location, $timeout, $window, API, $route, adminBreadcrumbService, processSelect2Service) {
    let url = API.getBaseUrl();
    let headers = API.getHeaders();

    $scope.initData = () => {
        $scope.selectedDates = ""
        $scope.selectPatientIds = [parseInt(API.getUser().split("-")[0])]
        $scope.selectDoctorIds = []
        $scope.formPatientRecord = {
            doctorId: null,
            dateFilter: moment(new Date()).format("DD/MM/YYYY")
        }

        $scope.listDoctorUnavailabilityAllDoctorDB = []
        $scope.listBillByAppointmentAndPatientDB = []
        $scope.listPrescriptionByAppointmentAndMedicinesDB = []
        $scope.appointmentIdParam = null
        $scope.patientIdParam = null

        $scope.initializeUIComponents()
        $scope.getListDoctor()
        $scope.getAllAppGroupByDate($scope.selectedDates, $scope.selectPatientIds, $scope.selectDoctorIds)
        $scope.getListDoctorUnavailabilityAllDoctor()
        $scope.getBillByAppointmentAndPatient($scope.appointmentIdParam, $scope.patientIdParam)
        $scope.getPrescriptionWithMedicinesByAppointment($scope.appointmentIdParam)
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
        $scope.selectPatientIds = [parseInt(API.getUser().split("-")[0])]
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

    $scope.isShowBtnCancel = (appointmentStatus) => {
        let checkStatus = ['đã đặt', 'đã xác nhận']
        let result = checkStatus.some(item => item == appointmentStatus.toLowerCase())
        return result
        //return true
    }

    $scope.cancelAppoinmnet=(appointment)=>{
        console.log("appointment",appointment);

        let du=$http.get(url+"")
        let service=$http.get(url+"")
        let apr =$http.get(url+"")

        // 1. set doctor bận is deleted là 1
        // 2. set dịch vụ của appinement is deleted là 1
        // 3. set appointment record is deleted là 1
        // 4. set stats của bảng appointment là Đã hủy và is deleted là 1
        
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

    $scope.getBillByAppointment = (appointmentId, listBillByAppointmentAndPatientDB) => {
        let bill = listBillByAppointmentAndPatientDB.filter(bill => bill.appointment.appointmentId === appointmentId)
        return bill
    }

    $scope.getBillByAppointmentAndPatient = (appointmentIdParam, patientIdParam) => {
        let params = {
            appointmentId: appointmentIdParam,
            patientId: patientIdParam
        }
        $http.get(url + '/bill-by-appointment-and-patient', { params: params, headers: headers }).then(response => {
            $scope.listBillByAppointmentAndPatientDB = response.data
        })
    }

    $scope.getPrescriptionByAppointment = (appointment, listPrescriptionByAppointmentAndMedicinesDB) => {
        let aprId = appointment.appointmentPatientRecord.appointmentPatientRecordId
        let filterData = listPrescriptionByAppointmentAndMedicinesDB.filter(item => item.prescription.appointmentPatientRecord.appointmentPatientRecordId === aprId)

        let uniqueMedicines = [];
        if (filterData.length != 0) {
            let medicines = filterData[0].medicinesList
            let prescription = filterData[0].prescription
            let prescriptionId = prescription.prescriptionId
            let filteredList = filterData[0].prescriptionMedicinesList.filter(item => item.prescription.prescriptionId === prescriptionId)


            let seenMedicineIds = new Set();
            filteredList.forEach(item => {
                if (!seenMedicineIds.has(item.medicines.medicinesId)) {
                    seenMedicineIds.add(item.medicines.medicinesId);
                    uniqueMedicines.push(item);
                }
            });

        }

        return uniqueMedicines
    }

    $scope.getPrescriptionWithMedicinesByAppointment = (appointmentId) => {
        let params = {
            appointmentId: appointmentId
        }
        $http.get(url + '/prescription-by-appointment', { params: params, headers: headers }).then(response => {
            $scope.listPrescriptionByAppointmentAndMedicinesDB = response.data
        })
    }

    $scope.initData()

});
