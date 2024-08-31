app.controller('AdminCTResultController', function ($scope, $http, $rootScope, $location, $timeout, API, adminBreadcrumbService) {
    let url = API.getBaseUrl();
    let headers = API.getHeaders();
    adminBreadcrumbService.generateBreadcrumb()
    //code here
    $scope.listDentalStaffsDB = [
        // Các nhân viên trong nha khoa
    ];

    $scope.listAppointmentsDB = [
        // Các cuộc hẹn trong nha khoa
    ];

    $scope.listImagingPlanesDB = [
        // Các hướng chụp trong nha khoa
    ];

    $scope.listCTResultsDB = [
        // Các ảnh chụp CT trong nha khoa
    ]

    $scope.listAbnormalitiesDB = [
        // Các dấu hiệu bất thường từ ảnh chụp
    ]

    $scope.listCTResultAbnormalitiesDB = [
        // Các phim chụp và bất thường tương ứng
    ]
    $scope.isUpdateCTResult = false
    $scope.isLoadingCreate = false
    $scope.isLoadingUpdate = false


    $scope.urlImg = (filename) => {
        return url + "/images/" + filename;
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
                singleDatePicker: true,
                timePicker: false,
                showDropdowns: true,
                locale:
                {
                    format: 'DD/MM/YYYY'
                }
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

        $('#dentalStaffId').on('change', function () {
            $timeout(function () {
                $scope.formCTResult.dentalStaffId = $('#dentalStaffId').val();
                console.log("dental staff id: ", $scope.formCTResult.dentalStaffId);
            });
        });
        $('#appointmentId').on('change', function () {
            $timeout(function () {
                $scope.formCTResult.appointmentId = $('#appointmentId').val();
            });
        });
        $('#imagingPlanesId').on('change', function () {
            $timeout(function () {
                $scope.formCTResult.imagingPlanesId = $('#imagingPlanesId').val();
            });
        });
        $('#abnormalityId').on('change', function () {
            $timeout(function () {
                $scope.formCTResultAbnormality.abnormalityId = $('#abnormalityId').val();
            });
        });
    }
    // Lấy danh sách cuộc hẹn từ DB
    $scope.getListAppointments = () => {
        $http.get(url + "/appointment-except-deleted", { headers: headers }).then(response => {
            $scope.listAppointmentsDB = response.data
        }).catch(err => {
            Swal.fire({
                title: "Thất bại!",
                html: '<p class="text-danger">Xảy ra lỗi!</p>',
                icon: "error"
            })
        })
    }
    // Lấy danh sách nhân viên từ DB
    $scope.getListDentalStaffs = () => {
        $http.get(url + "/dental-staff-except-deleted", { headers: headers }).then(response => {
            $scope.listDentalStaffsDB = response.data
        }).catch(err => {
            Swal.fire({
                title: "Thất bại!",
                html: '<p class="text-danger">Xảy ra lỗi!</p>',
                icon: "error"
            })
        })
    }

    $scope.getListImagingPlanes = () => {
        $http.get(url + "/imaging-planes-except-deleted", { headers: headers }).then(response => {
            $scope.listImagingPlanesDB = response.data
        }).catch(err => {
            Swal.fire({
                title: "Thất bại!",
                html: '<p class="text-danger">Xảy ra lỗi!</p>',
                icon: "error"
            })
        })
    }

    $scope.getListAbnormalities = () => {
        $http.get(url + "/abnormality-except-deleted", { headers: headers }).then(response => {
            $scope.listAbnormalitiesDB = response.data
        }).catch(err => {
            Swal.fire({
                title: "Thất bại!",
                html: '<p class="text-danger">Xảy ra lỗi!</p>',
                icon: "error"
            })
        })
    }
    // Lấy danh sách film chụp và vấn để bất thường
    $scope.getListCTResultAbnormalities = () => {
        $http.get(url + "/ct-result-abnormality-except-deleted", { headers: headers }).then(response => {
            $scope.listCTResultAbnormalitiesDB = response.data
        }).catch(err => {
            Swal.fire({
                title: "Thất bại!",
                html: '<p class="text-danger">Xảy ra lỗi!</p>',
                icon: "error"
            })
        })
    };

    //
    $scope.showCTResultAbnormality = (appointmentCTResultId) => {
        const result = $scope.listCTResultAbnormalitiesDB.find(item =>
            item.appointmentCTResult.appointmentCTResultId === appointmentCTResultId
        );

        return result;
    };

    // Start Xử lý hình ảnh
    $scope.filenames = []
    $scope.listImg = function () {
        $http.get(url + '/images', { headers: headers }).then(response => {
            $scope.filenames = response.data
            // lưu ảnh
        }).catch(error => {
            console.log("error", error);
        })
    }

    $scope.urlImage = (filename) => {
        console.log("this is urlImage")
        return "http://localhost:8081/api/v1/auth/uploadImage/" + filename;
    }

    $scope.uploadImg = (files) => {

        if (files == null) {
            alert("Upload hình chưa thành công")
            return
        }
        var form = new FormData();
        for (var i = 0; i < files.length; i++) {
            form.append("files", files[i]);
        }

        $http.post(url + "/saveImage/uploads", form, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined,
                ...headers
            }
        }).then(response => {
            var uploadedFilenames = response.data;

            // Lưu imageURL
            $scope.formCTResult.image = uploadedFilenames[0];

            // Lưu các tên file vào mảng $scope.filenames
            $scope.filenames.push(...uploadedFilenames);

            // Hiển thị hình ảnh từ các tên file này trên giao diện người dùng
            $scope.images = $scope.filenames.map(filename => {
                return {
                    url: 'assets/images/' + filename,
                    alt: 'Hình ảnh ' + filename
                };
            });
        }).catch(err => {
            console.log("error: ", err);
        })
    }

    $scope.deleteImg = (filename) => {
        $http.delete(url + "/deleteImage/images/" + filename, { headers: headers }).then(resp => {
            let i = $scope.filenames.findIndex(name => name == filename);
            $scope.filenames.splice(i, 1);
        }).catch(err => {
            console.log("error", err);
        })
    }

    // End Xử lý hình ảnh

    // Lấy danh sách ảnh chụp CT từ DB
    $scope.getListCTResults = () => {
        $http.get(url + '/appointment-ct-result-except-deleted', { headers: headers }).then(respone => {
            $scope.listCTResultsDB = respone.data
            // console.log("listDoctorDB",respone.data);
            if ($.fn.DataTable.isDataTable('#dataTable-list-ct-result')) {
                $('#dataTable-list-ct-result').DataTable().clear().destroy();
            }
            $(document).ready(function () {
                $('#dataTable-list-ct-result').DataTable({
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
        }).catch(err => {
            console.log("Error", err);
        })
    }
    $scope.crudCTResult = () => {
        var currentDate = new Date();
        $scope.formCTResult = {
            appointmentCTResultId: -1,
            image: '',
            dentalStaffId: '',
            AppointmentId: '',
            imagingPlanesId: '',
            date: new Date("01/01/2024"),
        }
        $scope.formCTResultAbnormality = {
            ctresultAbnormalityId: -1,
            abnormalityId: '',
            appointmentCTResult: '',
            description: '',
        }
        $scope.checkDate = function (dateTakeCT) {
            if (!dateTakeCT) return false;

            var dateTackPic = new Date(dateTakeCT);

            return dateTackPic <= currentDate;
        };

        $scope.validateDate = function () {
            return $scope.checkDate($scope.formCTResult.date);
        };

        // $scope.$watch('formDoctor.birthday', function (newVal, oldVal) {
        //     if (newVal !== oldVal) {
        //         $scope.validateBirthday();
        //     }
        // });

        $scope.validationForm = () => {
            var valid = false
            $scope.processSelect2Data = () => {
                if (typeof $scope.formCTResult.dentalStaffId === 'string' && $scope.formCTResult.dentalStaffId.includes(':')) {
                    $scope.formCTResult.dentalStaffId = parseInt($scope.formCTResult.dentalStaffId.split(':')[1]);
                }

                if (typeof $scope.formCTResult.appointmentId === 'string' && $scope.formCTResult.appointmentId.includes(':')) {
                    $scope.formCTResult.appointmentId = parseInt($scope.formCTResult.appointmentId.split(':')[1]);
                }

                if (typeof $scope.formCTResult.imagingPlanesId === 'string' && $scope.formCTResult.imagingPlanesId.includes(':')) {
                    $scope.formCTResult.imagingPlanesId = $scope.formCTResult.imagingPlanesId.split(':')[1];
                }

                if (typeof $scope.formCTResultAbnormality.abnormalityId === 'string' && $scope.formCTResultAbnormality.abnormalityId.includes(':')) {
                    $scope.formCTResultAbnormality.abnormalityId = $scope.formCTResultAbnormality.abnormalityId.split(':')[1];
                }
            }
            if (!$scope.validateDate()) {
                Swal.fire({
                    title: "Cảnh báo!",
                    html: "Ngày chụp phải nhỏ hơn hoặc bẳng ngày hiện tại!",
                    icon: "error"
                })
            }
            else if ($scope.formCTResult.dentalStaffId == "" || $scope.formCTResult.dentalStaffId == null) {
                Swal.fire({
                    title: "Cảnh báo!",
                    html: "Vui lòng chọn nhân viên!",
                    icon: "error"
                })
            }
            // else if ($scope.formCTResult.appointmentId == "" || $scope.formCTResult.appointmentId == null) {
            //     Swal.fire({
            //         title: "Cảnh báo!",
            //         html: "Vui lòng chọn bệnh nhân!",
            //         icon: "error"
            //     })
            // }
            else if ($scope.formCTResult.imagingPlanesId == "" || $scope.formCTResult.imagingPlanesId == null) {
                Swal.fire({
                    title: "Cảnh báo!",
                    html: "Vui lòng chọn hướng chụp!",
                    icon: "error"
                })
            }
            else if ($scope.formCTResultAbnormality.abnormalityId == "" || $scope.formCTResultAbnormality.abnormalityId == null) {
                Swal.fire({
                    title: "Cảnh báo!",
                    html: "Vui lòng chọn vấn đề bất thường!",
                    icon: "error"
                })
            }
            else {
                $scope.processSelect2Data()
                valid = true
            }
            return valid
        }

        $scope.editCTResult = (cs, $event) => {
            $event.preventDefault()
            $scope.isUpdateCTResult = true
            if (cs != null) {
                $scope.formCTResult = {
                    appointmentCTResultId: cs.appointmentCTResultId,
                    image: cs.imageURL,
                    dentalStaffId: cs.dentalStaff.dentalStaffId,
                    imagingPlanesId: cs.imagingPlanes.imagingPlanesId,
                    date: new Date(cs.date),
                }
                var cTResultAbnormality = $scope.showCTResultAbnormality(cs.appointmentCTResultId)
                $scope.formCTResultAbnormality = {
                    ctresultAbnormalityId: cTResultAbnormality.ctresultAbnormalityId,
                    abnormalityId: cTResultAbnormality.abnormality.abnormalityId,
                    appointmentCTResult: cTResultAbnormality.appointmentCTResult.appointmentCTResultId
                }
            }
            const firstTabButtonCreate = document.getElementById('form-tab-ct-result');
            firstTabButtonCreate.click();
        }

        $scope.createCTResult = () => {
            if ($scope.formCTResult.appointmentCTResultId != -1) {
                Swal.fire({
                    title: "Cảnh báo!",
                    html: "Thông tin đã có trên hệ thống!",
                    icon: "error"
                });
                return;
            }

            var valid = $scope.validationForm();
            if (valid) {
                $scope.isLoadingCreate = true
                var requestCTResultJSON = angular.toJson($scope.formCTResult);
                $http.post(url + '/appointment-ct-result', requestCTResultJSON, { headers: headers }).then(response => {
                    // Bắt đầu thêm bất thường của film chụp
                    $scope.formCTResultAbnormality.appointmentCTResult = response.data.appointmentCTResultId;
                    var requestCTResultAbnormalityJSON = angular.toJson($scope.formCTResultAbnormality);

                    $http.post(url + '/ct-result-abnormality', requestCTResultAbnormalityJSON, { headers: headers }).then(response => {
                        $timeout(() => {
                            $scope.isLoadingCreate = false
                        }, 3000)
                    }).finally(() => {
                        $timeout(() => {
                            Swal.fire({
                                position:"top-end",
                                title: "Thành công!",
                                html: "Đã thêm phim chụp thành công!",
                                icon: "success"
                            });
                            $scope.resetForm();
                            $scope.getListCTResultAbnormalities();
                            $scope.getListCTResults();

                            const secondTabButtonCreate = document.getElementById('list-tab-ct-result');
                            secondTabButtonCreate.click();
                        }, 3000)
                    }).catch(err => {
                        Swal.fire({
                            title: "Thêm bất thường thất bại!",
                            html: '<p class="text-danger">Xảy ra lỗi!</p>',
                            icon: "error"
                        });
                    });
                    // Kết thúc thêm bất thường của film chụp
                }).catch(err => {
                    Swal.fire({
                        title: "Thất bại!",
                        html: '<p class="text-danger">Xảy ra lỗi!</p>',
                        icon: "error"
                    });
                });
            }
        };


        $scope.updateCTResult = () => {
            if ($scope.formCTResult.appointmentCTResultId == -1) {
                Swal.fire({
                    title: "Cảnh báo!",
                    html: "Thông tin chưa có trên hệ thống!",
                    icon: "error"
                })
                return
            }
            var valid = $scope.validationForm()
            if (valid) {
                $scope.isLoadingUpdate = true
                var requestCTResultJSON = angular.toJson($scope.formCTResult)
                var appointmentCTResultId = $scope.formCTResult.appointmentCTResultId
                var requestCTResultAbnormalityJSON = angular.toJson($scope.formCTResultAbnormality);
                $http.put(url + '/ct-result-abnormality/' + $scope.formCTResultAbnormality.ctresultAbnormalityId, requestCTResultAbnormalityJSON, { headers: headers }).then(function (response) {
                    $http.put(url + '/appointment-ct-result/' + appointmentCTResultId, requestCTResultJSON, { headers: headers }).then(respone => {
                        $timeout(() => {
                            $scope.isLoadingUpdate = false
                        }, 3000)

                    }).finally(() => {
                        $timeout(() => {
                            Swal.fire({
                                title: "Thành công!",
                                html: "Cập nhật thành công!",
                                icon: "success"
                            })
                            $scope.resetForm()
                            $scope.getListCTResultAbnormalities()
                            $scope.getListCTResults()
                            const secondTabButtonCreate = document.getElementById('list-tab-ct-result');
                            secondTabButtonCreate.click();
                        }, 3000)
                    })
                        .catch(err => {
                            Swal.fire({
                                title: "Thất bại!",
                                html: '<p class="text-danger">Cập nhật thất bại!</p>',
                                icon: "error"
                            })
                        })
                })

            }

        }

        $scope.deleteCTResult = (cs, $event) => {
            $event.preventDefault()
            var appointmentCTResultId = cs.appointmentCTResultId
            Swal.fire({
                text: "Bạn có muốn xóa ảnh này ?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Trở lại',
                confirmButtonText: 'Có'
            }).then(rs => {
                if (rs.isConfirmed) {
                    $http.delete(url + '/soft-delete-appointment-ct-result/' + appointmentCTResultId).then(respone => {
                        Swal.fire({
                            title: "Thành công!",
                            html: "Đã xóa thành công!",
                            icon: "success"
                        })
                        $scope.getListCTResults()
                    }).catch(err => {
                        Swal.fire({
                            title: "Thất bại!",
                            html: '<p class="text-danger">Xảy ra lỗi!</p>',
                            icon: "error"
                        })
                    })
                }
            })
        }

        $scope.resetForm = () => {
            $scope.isUpdateCTResult = false
            $scope.isLoadingCreate = false
            $scope.isLoadingUpdate = false
            $scope.formCTResult = {
                image: '',
                appointmentCTResultId: -1,
                dentalStaffId: '',
                AppointmentId: '',
                imagingPlanesId: '',
                date: new Date("01/01/2024"),
            }
            $scope.formCTResultAbnormality = {
                ctresultAbnormalityId: -1,
                abnormalityId: '',
                appointmentCTResult: '',
                description: '',
            }
            $('#imagingPlanesId').val(null).trigger('change');
            $('#appointmentId').val(null).trigger('change');
            $('#dentalStaffId').val(null).trigger('change');
            $('#abnormalityId').val(null).trigger('change');
        }
    }

    $scope.initializeUIComponents()
    $scope.getListAbnormalities()
    $scope.getListAppointments()
    $scope.getListDentalStaffs()
    $scope.getListImagingPlanes()
    $scope.getListCTResultAbnormalities()
    $scope.getListCTResults()
    $scope.crudCTResult()
})