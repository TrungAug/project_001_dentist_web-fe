app.controller('AdminListAppoinment', function ($scope, $http, $rootScope, $location, $timeout) {
    let url = "http://localhost:8081/api/v1/auth"
    let headers = {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
        "X-Refresh-Token": localStorage.getItem("refreshToken"),
    }
    //code here
    $scope.setupTab = () => {
        $scope.currentTab = -1;
        $scope.selectTab = (tab, $event) => {
            $event.preventDefault()
            $scope.currentTab = tab;
        }
        $scope.isSelected = (tab) => {
            return $scope.currentTab === tab;
        }
    }
    $scope.setupSubtab = () => {
        $scope.currentSubTab = -1;
        $scope.selectSubTab = (tab, $event) => {
            $event.preventDefault()
            $scope.currentSubTab = tab;
        }
        $scope.isSelectedSubTab = (tab) => {
            return $scope.currentSubTab === tab;
        }
    }


    // $scope.initializeFullCalendar = (calendarId, doctorId) => {
    //     var events = [
    //         {
    //             title: "Kiểm tra răng",
    //             start: "2024-06-15T18:30:00",
    //             end: "2024-06-15T19:00:00",
    //             doctor: "Bs. Hoàn Đinh",
    //             patient: "Vĩ Khang",
    //             service: "Kiểm tra răng"
    //         },
    //         {
    //             title: "Trám răng",
    //             start: "2024-06-15T10:30:00",
    //             end: "2024-06-15T11:30:00",
    //             doctor: "Bs. Đức Anh",
    //             patient: "Bảo Trân",
    //             service: "Trám răng"
    //         },
    //         {
    //             title: "Lấy cao răng",
    //             start: "2024-06-16T14:00:00",
    //             end: "2024-06-16T15:00:00",
    //             doctor: "Bs. Hoàng Tuấn",
    //             patient: "Hồng Đào",
    //             service: "Lấy cao răng"
    //         },
    //         {
    //             title: "Nhổ răng",
    //             start: "2024-06-16T15:00:00",
    //             end: "2024-06-16T16:00:00",
    //             doctor: "Bs. Hoàng Tuấn",
    //             patient: "Hồng Đào",
    //             service: "Lấy cao răng"
    //         },
    //         {
    //             title: "Trám răng",
    //             start: "2024-06-16T16:00:00",
    //             end: "2024-06-16T17:00:00",
    //             doctor: "Bs. Hoàng Tuấn",
    //             patient: "Hồng Đào",
    //             service: "Lấy cao răng"
    //         },
    //         {
    //             title: "Lấy chỉ răng",
    //             start: "2024-06-16T17:00:00",
    //             end: "2024-06-16T18:00:00",
    //             doctor: "Bs. Hoàng Tuấn",
    //             patient: "Hồng Đào",
    //             service: "Lấy cao răng"
    //         },
    //         {
    //             title: "Trồng răng",
    //             start: "2024-06-16T18:00:00",
    //             end: "2024-06-16T19:00:00",
    //             doctor: "Bs. Hoàng Tuấn",
    //             patient: "Hồng Đào",
    //             service: "Lấy cao răng"
    //         }
    //     ];

    //     var calendarEl = document.getElementById(calendarId);
    //     if (calendarEl) {
    //         var calendar = new FullCalendar.Calendar(calendarEl,
    //             {
    //                 plugins: ['timeGrid', 'list', 'bootstrap'],
    //                 timeZone: 'UTC',
    //                 themeSystem: 'bootstrap',
    //                 header:
    //                 {
    //                     left: 'today, prev, next',
    //                     center: 'title',
    //                     right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
    //                 },
    //                 buttonIcons:
    //                 {
    //                     prev: 'fe-arrow-left',
    //                     next: 'fe-arrow-right',
    //                     prevYear: 'left-double-arrow',
    //                     nextYear: 'right-double-arrow'
    //                 },
    //                 weekNumbers: true,
    //                 eventLimit: true, // allow "more" link when too many events
    //                 locale: 'vi', // Thiết lập ngôn ngữ tiếng Việt
    //                 buttonText: {
    //                     today: 'Hôm nay',
    //                     month: 'Tháng',
    //                     week: 'Tuần',
    //                     day: 'Ngày',
    //                     list: 'Lịch sử'
    //                 },
    //                 slotLabelFormat: {
    //                     hour: '2-digit',
    //                     minute: '2-digit',
    //                     hour12: false // Thiết lập định dạng 24 giờ
    //                 },
    //                 events: events,
    //                 eventClick: function (info) {
    //                     console.log("info", info);
    //                     var eventDetails =
    //                         '<strong>Tên bác sĩ:</strong> ' + info.event.extendedProps.doctor + '<br>' +
    //                         '<strong>Tên bệnh nhân:</strong> ' + info.event.extendedProps.patient + '<br>' +
    //                         '<strong>Dịch vụ:</strong> ' + info.event.extendedProps.service + '<br>' +
    //                         '<strong>Thời gian bắt đầu:</strong> ' + info.event.start.toLocaleString() + '<br>' +
    //                         '<strong>Thời gian kết thúc:</strong> ' + info.event.end.toLocaleString();
    //                     document.getElementById('eventDetailsBody').innerHTML = eventDetails;
    //                     const btnEventDetails = document.getElementById('btnEventDetails');
    //                     btnEventDetails.click();
    //                 }
    //             });
    //         calendar.render();
    //     }
    // }
    // $scope.initializeCalendars = () => {
    //     $timeout(() => {
    //         angular.forEach($scope.listDoctorDB, (doctor) => {
    //             var calendarId = 'calendar-doctor-' + doctor.doctorId;
    //             $scope.initializeFullCalendar(calendarId, doctor.doctorId);
    //         });
    //     }, 0);
    // }

    $scope.initializeFullCalendar = () => {
        /** full calendar */
        var events = [
            {
                title: "Kiểm tra răng",
                start: "2024-06-15T18:30:00",
                end: "2024-06-15T19:00:00",
                doctor: "Bs. Hoàn Đinh",
                patient: "Vĩ Khang",
                service: "Kiểm tra răng"
            },
            {
                title: "Trám răng",
                start: "2024-06-15T10:30:00",
                end: "2024-06-15T11:30:00",
                doctor: "Bs. Đức Anh",
                patient: "Bảo Trân",
                service: "Trám răng"
            },
            {
                title: "Lấy cao răng Lấy cao răng Lấy cao răng Lấy cao răng Lấy cao răng",
                start: "2024-06-16T14:00:00",
                end: "2024-06-16T15:00:00",
                doctor: "Bs. Hoàng Tuấn",
                patient: "Hồng Đào",
                service: "Lấy cao răng"
            },
            {
                title: "Nhổ răng",
                start: "2024-06-16T15:00:00",
                end: "2024-06-16T16:00:00",
                doctor: "Bs. Hoàng Tuấn",
                patient: "Hồng Đào",
                service: "Lấy cao răng"
            },
            {
                title: "Trám răng",
                start: "2024-06-16T16:00:00",
                end: "2024-06-16T17:00:00",
                doctor: "Bs. Hoàng Tuấn",
                patient: "Hồng Đào",
                service: "Lấy cao răng"
            },
            {
                title: "Lấy chỉ răng",
                start: "2024-06-16T17:00:00",
                end: "2024-06-16T18:00:00",
                doctor: "Bs. Hoàng Tuấn",
                patient: "Hồng Đào",
                service: "Lấy cao răng"
            },
            {
                title: "Trồng răng Trồng răng Trồng răng Trồng răng Trồng răng Trồng răng",
                start: "2024-06-16T18:00:00",
                end: "2024-06-16T19:00:00",
                doctor: "Bs. Hoàng Tuấn",
                patient: "Hồng Đào",
                service: "Lấy cao răng"
            }
        ];
        var calendarEl = document.getElementById('calendar-doctor-appoinment');
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
                        console.log("info",info);
                        var eventDetails =
                            '<strong>Tên bác sĩ:</strong> ' + info.event.extendedProps.doctor + '<br>' +
                            '<strong>Tên bệnh nhân:</strong> ' + info.event.extendedProps.patient + '<br>' +
                            '<strong>Dịch vụ:</strong> ' + info.event.extendedProps.service + '<br>' +
                            '<strong>Thời gian bắt đầu:</strong> ' + info.event.start.toLocaleString() + '<br>' +
                            '<strong>Thời gian kết thúc:</strong> ' + info.event.end.toLocaleString();
                            document.getElementById('eventDetailsBody').innerHTML = eventDetails;
                            const btnEventDetails = document.getElementById('btnEventDetails');
                            btnEventDetails.click();
                    }
                });
            calendar.render();
        }
    }

    $scope.initializeUIComponents = () => {
        $('.select2').select2(
            {
                theme: 'bootstrap4',
            });
        $('.select2-multi').select2(
            {
                multiple: true,
                theme: 'bootstrap4',
            });
        $('.drgpicker').daterangepicker(
            {
                singleDatePicker: false,
                timePicker: false,
                showDropdowns: true,
                minDate: moment().add(1, 'days'),
                locale:
                {
                    format: 'DD/MM/YYYY',
                    applyLabel: 'Áp dụng',
                    cancelLabel: 'Hủy',
                },
                isInvalidDate: function (date) {
                    // Chặn các ngày trong mảng disabledDates
                    return registeredDates.includes(date.format('YYYY-MM-DD'));
                }
            }
        );
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
        $('#formDoctorScheduleShiftId').on('change', function () {
            $timeout(function () {
                selecteShiftdValues = $('#formDoctorScheduleShiftId').val()
                $scope.processSelect2Data(selecteShiftdValues)
            });
        });
        $scope.processSelect2Data = function (values) {
            // Chia tách các giá trị thành mảng
            var processedValues = values.map(function (value) {
                // Loại bỏ các ký tự không phải là số và chuyển đổi thành số
                var numericValue = parseInt(value.replace(/\D/g, ''), 10);
                return isNaN(numericValue) ? null : numericValue;
            }).filter(function (value) {
                return value !== null;
            });
            selecteShiftdValues = processedValues;
        };
    }

    $scope.getListDoctor = () => {
        $http.get(url + '/doctor').then(respone => {
            $scope.listDoctorDB = respone.data
            console.log("$scope.listDoctorDB", $scope.listDoctorDB);
            //$scope.initializeCalendars()
        }).catch(err => {
            console.log("Error", err);
        })
    }
    $scope.listAppoinmentInfo = () => {
        $http.get(url + '/appointment').then(response => {
            $scope.listAppoinmentFromDB = response.data
            console.log("$scope.listAppoinmentFromDB", $scope.listAppoinmentFromDB);
            if ($.fn.DataTable.isDataTable('#dataTable-list-appoinment')) {
                $('#dataTable-list-appoinment').DataTable().clear().destroy();
            }
            $(document).ready(function () {
                $('#dataTable-list-appoinment').DataTable({
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
                    }
                });
                $scope.$apply()
            });
        }).catch(error => {
            console.log("error", error);
        })
    }
    // $timeout(function() {
    //     $('#dataTable-list-appoinment').DataTable({
    //         autoWidth: true,
    //         "lengthMenu": [
    //             [16, 32, 64, -1],
    //             [16, 32, 64, "All"]
    //         ]
    //     });
    // }, 0);


    $scope.setupTab()
    $scope.setupSubtab()
    $scope.getListDoctor()
    $scope.listAppoinmentInfo()
    $scope.initializeFullCalendar()
    $scope.initializeUIComponents()
})