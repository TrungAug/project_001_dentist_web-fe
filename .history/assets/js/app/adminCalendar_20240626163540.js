console.log("AdminCalendar");
app.controller('AdminCalendar', function ($scope, $http, $rootScope, $location, $timeout, processSelect2Service, TimezoneService) {
    let url = "http://localhost:8081/api/v1/auth"
    let headers = {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
        "X-Refresh-Token": localStorage.getItem("refreshToken"),

    }
    //code here
    var defaultTimezone = "Asia/Ho_Chi_Minh";
    $scope.listTOS = []
    var dentalStaff = 1 // up date lấy id của denatlSatff khi login  

    $scope.setupTab = () => {
        $scope.currentTab = { shiftId: -1, doctorId: -1 };
        $scope.selectTab = (shiftId, doctorId, $event) => {
            var dateSelected = $scope.formAppointmentRequest.appointmentDate
            $scope.formAppointmentRequest.doctorId = doctorId
            $event.preventDefault();
            $scope.currentTab = { shiftId: shiftId, doctorId: doctorId };
            $scope.timeOfShiftDB(shiftId, dateSelected, doctorId)
                .then(function (data) {
                    $scope.listTOS = data;
                    console.log("$scope.listTOS okkkk", $scope.listTOS);
                })
                .catch(function (error) {
                    console.error('Có lỗi khi lấy dữ liệu theo shiftId ' + shiftId + ' và doctorId ' + doctorId + ':', error);
                });
        };
        $scope.isSelected = (shiftId, doctorId) => {
            return $scope.currentTab.shiftId === shiftId && $scope.currentTab.doctorId === doctorId;
        };
    }

    $scope.initializeFullCalendar = () => {
        /** full calendar */
        var events = ""
        $scope.processDoctorUnavailabilityAllDoctor().then(result => {

            events = result.map(item => {
                var dateWithBeginTime = moment(`${item.date.split("T")[0]}T${item.timeOfShift.beginTime}`);
                var dateWithEndTime = moment(`${item.date.split("T")[0]}T${item.timeOfShift.endTime}`);
                return {
                    title: item.description,
                    date: item.date,
                    // start: `${item.date.split("T")[0]}T${item.timeOfShift.beginTime}`,
                    // end: `${item.date.split("T")[0]}T${item.timeOfShift.endTime}`,
                    start: TimezoneService.convertToTimezone(dateWithBeginTime, defaultTimezone),
                    end: TimezoneService.convertToTimezone(dateWithEndTime, defaultTimezone),
                    doctor: item.doctor.fullName,
                };
            });
            console.log("result", result);
            console.log("events", events);
            var calendarEl = document.getElementById('calendar-book-appointment');
            if (calendarEl) {
                var calendar = new FullCalendar.Calendar(calendarEl,
                    {
                        plugins: ['dayGrid', 'timeGrid', 'list', 'bootstrap'],
                        timeZone: 'UTC',
                        themeSystem: 'bootstrap',
                        header:
                        {
                            left: 'today, prev, next',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
                        },
                        buttonIcons:
                        {
                            prev: 'fe-arrow-left',
                            next: 'fe-arrow-right',
                            prevYear: 'left-double-arrow',
                            nextYear: 'right-double-arrow'
                        },
                        weekNumbers: true,
                        eventLimit: true, // allow "more" link when too many events
                        //events: 'https://fullcalendar.io/demo-events.json'
                        locale: 'vi', // Thiết lập ngôn ngữ tiếng Việt
                        buttonText: {
                            today: 'Hôm nay',
                            month: 'Tháng',
                            week: 'Tuần',
                            day: 'Ngày',
                            list: 'Lịch sử'
                        },
                        slotLabelFormat: {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false // Thiết lập định dạng 24 giờ
                        },
                        events: events,
                        eventClick: function (info) {
                            console.log("info", info);
                            var eventDetails =
                                '<strong>Tên bác sĩ:</strong> ' + info.event.extendedProps.doctor + '<br>' +
                                '<strong>Bệnh nhân:</strong> ' + info.event.extendedProps.description + '<br>' +
                                '<strong>Thời gian bắt đầu:</strong> ' + moment(info.event.start).format('YYYY-MM-DD HH:mm:ss') + '<br>' +
                                '<strong>Thời gian kết thúc:</strong> ' + moment(info.event.end).format('YYYY-MM-DD HH:mm:ss');
                            document.getElementById('eventDetailsBody').innerHTML = eventDetails;
                            const btnEventDetails = document.getElementById('btnEventDetails');
                            btnEventDetails.click();
                        }
                    });
                calendar.render();
            }
        });

    }

    $scope.initializeUIComponents = () => {
        $('.select2').select2(
            {
                theme: 'bootstrap4',
                placeholder: 'Select an option',
                allowClear: true
            });
        $('.select2-multi').select2(
            {
                multiple: true,
                theme: 'bootstrap4',
            });
        $('.drgpicker').daterangepicker(
            {
                singleDatePicker: true,
                timePicker: false,
                showDropdowns: true,
                locale:
                {
                    format: 'DD/MM/YYYY',
                    applyLabel: 'Áp dụng',
                    cancelLabel: 'Hủy',
                },
            },
            // function (start, end, label) {
            //     alert('A new date selection was made: ' + start.format('DD/MM/YYYY'));
            // }
        );
        $('.drgpicker').on('apply.daterangepicker', function (ev, picker) {
            var selectedDate = picker.startDate.format('DD/MM/YYYY');
            $scope.getListDoctorSchedule(selectedDate)
            $scope.formAppointmentRequest.appointmentDate = picker.startDate.toDate()
            // console.log("picker.startDate",$scope.formAppointmentRequest.appointmentDate);
            //alert(selectedDate)
        });
        $('.time-input').timepicker(
            {
                'scrollDefault': 'now',
                'zindex': '9999' /* fix modal open */
            });
        /** date range picker */
        if ($('.datetimes').length) {
            $('.datetimes').daterangepicker(
                {
                    timePicker: true,
                    startDate: moment().startOf('hour'),
                    endDate: moment().startOf('hour').add(32, 'hour'),
                    locale:
                    {
                        format: 'M/DD hh:mm A'
                    }
                });
        }
        var start = moment().subtract(29, 'days');
        var end = moment();

        function cb(start, end) {
            $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        }
        $('#reportrange').daterangepicker(
            {
                startDate: start,
                endDate: end,
                ranges:
                {
                    'Today': [moment(), moment()],
                    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                }
            }, cb);
        cb(start, end);
        $('.input-placeholder').mask("00/00/0000",
            {
                placeholder: "__/__/____"
            });
        $('.input-zip').mask('00000-000',
            {
                placeholder: "____-___"
            });
        $('.input-money').mask("#.##0,00",
            {
                reverse: true
            });
        $('.input-phoneus').mask('(000) 000-0000');
        $('.input-mixed').mask('AAA 000-S0S');
        $('.input-ip').mask('0ZZ.0ZZ.0ZZ.0ZZ',
            {
                translation:
                {
                    'Z':
                    {
                        pattern: /[0-9]/,
                        optional: true
                    }
                },
                placeholder: "___.___.___.___"
            });
        // editor
        var editor = document.getElementById('editor');
        if (editor) {
            var toolbarOptions = [
                [
                    {
                        'font': []
                    }],
                [
                    {
                        'header': [1, 2, 3, 4, 5, 6, false]
                    }],
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [
                    {
                        'header': 1
                    },
                    {
                        'header': 2
                    }],
                [
                    {
                        'list': 'ordered'
                    },
                    {
                        'list': 'bullet'
                    }],
                [
                    {
                        'script': 'sub'
                    },
                    {
                        'script': 'super'
                    }],
                [
                    {
                        'indent': '-1'
                    },
                    {
                        'indent': '+1'
                    }], // outdent/indent
                [
                    {
                        'direction': 'rtl'
                    }], // text direction
                [
                    {
                        'color': []
                    },
                    {
                        'background': []
                    }], // dropdown with defaults from theme
                [
                    {
                        'align': []
                    }],
                ['clean'] // remove formatting button
            ];
            var quill = new Quill(editor,
                {
                    modules:
                    {
                        toolbar: toolbarOptions
                    },
                    theme: 'snow'
                });
        }
        // Example starter JavaScript for disabling form submissions if there are invalid fields
        (function () {
            'use strict';
            window.addEventListener('load', function () {
                // Fetch all the forms we want to apply custom Bootstrap validation styles to
                var forms = document.getElementsByClassName('needs-validation');
                // Loop over them and prevent submission
                var validation = Array.prototype.filter.call(forms, function (form) {
                    form.addEventListener('submit', function (event) {
                        if (form.checkValidity() === false) {
                            event.preventDefault();
                            event.stopPropagation();
                        }
                        form.classList.add('was-validated');
                    }, false);
                });
            }, false);
        })();

        $scope.formAppointmentRequest.appointmentDate = $('#appointmentDateRequest').val()

        $('#formAppointmentRequestPatientId').on('change', function () {
            $timeout(function () {
                var selectedVal = $('#formAppointmentRequestPatientId').val();
                $scope.formAppointmentRequest.patientId = processSelect2Service.processSelect2Data(selectedVal)[0]
            });
        });

        $('#formAppointmentRequestAppointmentType').on('change', function () {
            $timeout(function () {
                var selectedVal = $('#formAppointmentRequestAppointmentType').val()
                $scope.formAppointmentRequest.appointmentType = processSelect2Service.processSelect2Data(selectedVal)[0]
            });
        });

        $scope.getCurrentTime = () => {
            var now = new Date();
            var hours = String(now.getHours()).padStart(2, '0');
            var minutes = String(now.getMinutes()).padStart(2, '0');
            var seconds = String(now.getSeconds()).padStart(2, '0');

            return hours + ":" + minutes + ":" + seconds;
        };

        $scope.isVisible = (beginTime) => {
            var appointmentDateStr = $('#appointmentDateRequest').val()
            var appointmentDate = moment(appointmentDateStr, "DD/MM/YYYY").toDate();
            var today = new Date();
            today.setHours(0, 0, 0, 0);
            if (appointmentDate.getTime() === today.getTime()) {
                return $scope.getCurrentTime() <= beginTime
            }
            return true
        };
        $scope.allShiftsHidden = () => {
            return $scope.listTOS.length === 0 || $scope.listTOS.every((tos) => !$scope.isVisible(tos.beginTime));
        };
    }

    $scope.onChangeTimeOfShiftId = function (timeOfShiftId) {
        $scope.formDoctorUnavailabilityRequest.timeOfShiftId = timeOfShiftId;
    }

    $scope.initializeUppyUploader = () => {
        var uptarg = document.getElementById('drag-drop-area');
        if (uptarg) {
            var uppy = Uppy.Core().use(Uppy.Dashboard,
                {
                    inline: true,
                    target: uptarg,
                    proudlyDisplayPoweredByUppy: false,
                    theme: 'dark',
                    width: 770,
                    height: 210,
                    plugins: ['Webcam']
                }).use(Uppy.Tus,
                    {
                        endpoint: 'https://master.tus.io/files/'
                    });
            uppy.on('complete', (result) => {
                console.log('Upload complete! We’ve uploaded these files:', result.successful)
            });
        }
    }

    $scope.listServiceInfo = () => {
        $http.get(url + '/service').then(response => {
            $scope.listServiceFromDB = response.data
        }).catch(error => {
            console.log("error", error);
        })
    }

    $scope.getListPatient = () => {
        $http.get(url + '/patient').then(response => {
            $scope.listPatientDB = response.data
        })
    }

    $scope.getListDoctor = () => {
        $http.get(url + '/doctor').then(respone => {
            $scope.listDoctorDB = respone.data
        }).catch(err => {
            console.log("Error", err);
        })
    }

    $scope.getListDoctorSchedule = (date) => {
        var dateRequest = {
            date: moment(date, "DD/MM/YYYY").format("YYYY-MM-DD")
        }
        $http.get(url + '/doctor-schedule-by-date', { params: dateRequest }).then(response => {
            let doctorMap = new Map();
            response.data.forEach(d => {
                if (d.doctor) {
                    doctorMap.set(d.doctor.doctorId, d.doctor);
                }
            });

            // Chuyển Map thành mảng
            $scope.doctorDB = Array.from(doctorMap.values());
            $scope.shiftDB = (doctorId) => {
                var shift = response.data
                    .filter(item => item.doctor && item.doctor.doctorId === doctorId)
                    .map(item => item.shift);
                return shift
            }
        })
    }

    $scope.timeOfShiftDB = (shiftId, dateSelected, doctorId) => {
        var convertedDate = TimezoneService.convertToTimezone(dateSelected, defaultTimezone)
        var params = {
            shiftId: shiftId,
            date: convertedDate,
            doctorId: doctorId
        }
        console.log("params", params);
        return $http.get(url + '/time-of-shift-available', { params: params }).then(response => {
            return response.data
        }).catch(error => {
            console.log("Error: " + error)
            throw error
        })
    }

    $scope.getListAppointmentStatus = () => {
        $http.get(url + '/appointment-status').then(respone => {
            $scope.listAppointmentStatusDB = respone.data
            console.log(" $scope.listAppointmentStatusDB", $scope.listDentalStaffDB);
        }).catch(err => {
            console.log("Error", err);
        })
    }

    $scope.getListAppointmentType = () => {
        $http.get(url + '/appointment-type').then(respone => {
            $scope.listAppointmentTypeDB = respone.data
        }).catch(err => {
            console.log("Error", err);
        })
    }

    $scope.getListAppointmentStatus = () => {
        $http.get(url + '/appointment-status').then(resp => {
            $scope.listAppointmentStatusBD = resp.data
            $scope.formAppointmentRequest.appointmentStatus = $scope.listAppointmentStatusBD.find((item) => item.status.toLowerCase() === 'đã xác nhận').appointment_StatusId
        })
    }

    $scope.processDoctorUnavailabilityAllDoctor = () => {
        return new Promise((resolve, reject) => {
            $http.get(url + '/doctorUnavailability').then((response) => {
                resolve(response.data)
            }).catch((error) => reject(error))
        })
    }

    $scope.initData = () => {
        $scope.formAppointmentRequest = {
            patientId: -1,
            appointmentPatientRecord: -1,
            appointmentType: -1,
            doctorId: -1,
            dentalStaffId: dentalStaff,
            // appointmentStatus: -1,
            appointmentDate: moment(new Date()).format("DD/MM/YYYY"),
            note: "",
            createAt: new Date(),
            isDeleted: false
        }
        $scope.formDoctorUnavailabilityRequest = {
            description: "",
            timeOfShiftId: -1,
            doctorId: -1,
            date: "",
            isDeleted: false
        }

        $scope.formAppointmentPatientRecordRequest = {
            patientId: -1,
            createAt: "",
            currentCondition: "",
            reExamination: "",
            isDeleted: false
        }
    }

    $scope.validationForm = () => {
        var patientId = $scope.formAppointmentRequest.patientId
        var appointmentType = $scope.formAppointmentRequest.appointmentType
        var appointmentDate = $scope.formAppointmentRequest.appointmentDate
        var note = $scope.formAppointmentRequest.note
        var doctorId = $scope.formAppointmentRequest.doctorId
        var tosId = $scope.formDoctorUnavailabilityRequest.timeOfShiftId
        var title = $scope.formDoctorUnavailabilityRequest.description
        // var mess = "patientId: " + patientId + " appointmentType " + appointmentType + " appointmentDate: " + appointmentDate + " note " + note + " doctorId: " + doctorId + " tosId: " + tosId
        var valid = true

        if (title == "" || title == null) {
            Swal.fire({
                title: "Cảnh báo!",
                html: "Vui lòng điền tiêu đề cuộc hẹn!",
                icon: "error"
            })
            valid = false
        } else if (patientId == -1) {
            Swal.fire({
                title: "Cảnh báo!",
                html: "Vui lòng chọn bệnh nhân!",
                icon: "error"
            })
            valid = false
        } else if (appointmentType == -1) {
            Swal.fire({
                title: "Cảnh báo!",
                html: "Vui lòng chọn loại cuộc hẹn!",
                icon: "error"
            })
            valid = false
        } else if (doctorId == -1) {
            Swal.fire({
                title: "Cảnh báo!",
                html: "Vui lòng chọn bác sĩ khám!",
                icon: "error"
            })
            valid = false
        } else if (tosId == -1) {
            Swal.fire({
                title: "Cảnh báo!",
                html: "Vui lòng chọn thời gian khám!",
                icon: "error"
            })
            valid = false
        }
        return valid
    }

    $scope.saveAppointment = async () => {
        var appointmentDate = $scope.formAppointmentRequest.appointmentDate;
        var convertedDate = TimezoneService.convertToTimezone(appointmentDate, defaultTimezone)
        $scope.formAppointmentRequest.appointmentDate = convertedDate
        var valid = $scope.validationForm()
        if (valid) {
            try {
                // Lưu đơn yêu cầu hẹn
                var appointmentRequestJSON = angular.toJson($scope.formAppointmentRequest);
                console.log("appointmentRequestJSON", appointmentRequestJSON);

                var response = await $http.post(url + '/appointment', appointmentRequestJSON);
                $scope.getDataAfterPostAppointmentSuccess = response.data;

                // Tạo lịch làm việc bác sĩ
                $scope.formDoctorUnavailabilityRequest.date = $scope.getDataAfterPostAppointmentSuccess.appointmentDate;
                $scope.formDoctorUnavailabilityRequest.doctorId = $scope.getDataAfterPostAppointmentSuccess.doctor == null ? null : $scope.getDataAfterPostAppointmentSuccess.doctor.doctorId
                var doctorUnavailabilityRequestJSON = angular.toJson($scope.formDoctorUnavailabilityRequest);
                var res = await $http.post(url + '/doctorUnavailability', doctorUnavailabilityRequestJSON);

                // Tạo appointment record
                $scope.formAppointmentPatientRecordRequest.patientId = $scope.getDataAfterPostAppointmentSuccess.patientId;
                $scope.formAppointmentPatientRecordRequest.createAt = $scope.getDataAfterPostAppointmentSuccess.createAt;
                var appointmentRecordRequestJSON = angular.toJson($scope.formAppointmentPatientRecordRequest);
                var resp = await $http.post(url + '/appointment-patient-record', appointmentRecordRequestJSON);

                console.log("Appointment response", response);
                console.log("Doctor unavailability response", res);
                console.log("Appointment Record response ", resp);
                // Sau khi hoàn thành, khởi tạo lại dữ liệu
                Swal.fire({
                    title: "Thành công!",
                    html: "Đặt lịch hẹn thành công",
                    icon: "success"
                })
                $scope.initData();
            } catch (error) {
                console.log("Error:", error);
            }
        }
    }


    $scope.setupTab()
    $scope.initData()
    $scope.initializeFullCalendar();
    $scope.initializeUIComponents();
    $scope.initializeUppyUploader();
    $scope.listServiceInfo()
    $scope.getListDoctor()
    $scope.getListPatient()
    $scope.getListAppointmentStatus()
    $scope.getListAppointmentType()

})


// $scope.getTimeDataFromDB = function() {
//     $http.get('/api/time-data') // Đổi lại đường dẫn API của bạn
//         .then(function(response) {
//             $scope.timeData = response.data; // Lưu dữ liệu từ DB vào $scope.timeData
//             // Sau khi nhận được dữ liệu, gọi hàm để khởi tạo timepicker
//             $scope.initializeTimepicker();
//         })
//         .catch(function(error) {
//             console.error('Error fetching time data:', error);
//         });
// };

// // Hàm khởi tạo timepicker với dữ liệu từ DB
