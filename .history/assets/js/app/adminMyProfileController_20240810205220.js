app.controller('AdminMyProfileController', function ($scope, $http, $rootScope, $location, $timeout, API, $route, adminBreadcrumbService, processSelect2Service) {
    let url = API.getBaseUrl();
    let headers = API.getHeaders();
    adminBreadcrumbService.generateBreadcrumb()
    // code here
    let accountId = API.getUser().split("-")[0]
    let roleName = API.getUser().split("-")[1]
    let email = API.getUser().split("-")[2]
    $scope.account = null
    $scope.filenames = []
    $scope.initData = () => {
        $scope.formDoctor = {
            image: "",
            doctorId: "",
            fullName: "",
            degrees: "",
            phoneNumber: "",
            gender: "",
            address: "",
            birthday: "",
            signature: "",
            specialty: "",
            deleted: ""
        }
        $scope.formStaff = {
            fullName: "",
            phoneNumber: "",
            address: "",
            birthday: "",
            imageURL: "",
            gender: "",
            departmentId: ""
        }
        $scope.listDegreesTypeDB = [
            { degreesId: 1, degreesName: 'Thạc sĩ' },
            { degreesId: 2, degreesName: 'Tiến sĩ' },
            { degreesId: 3, degreesName: 'Bác sĩ' },
            { degreesId: 4, degreesName: 'Giáo sư' },
            { degreesId: 5, degreesName: 'Y tá' },
            { degreesId: 6, degreesName: 'Y sĩ' },
            // Các chuyên khoa khác trong nha khoa
        ];

        $scope.listGenderTypeDB = [
            { genderId: 'MALE', genderName: 'Nam' },
            { genderId: 'FEMALE', genderName: 'Nữ' },
            { genderId: 'UNISEX', genderName: 'Khác' }
        ];
        $scope.getListSpecialtyType()
        $scope.initializeUIComponents()
    }

    $scope.getListSpecialtyType = () => {
        $http.get(url + "/specialty").then(response => {
            $scope.listSpecialtyTypeDB = response.data
        }).catch(err => {
            Swal.fire({
                title: "Thất bại!",
                html: '<p class="text-danger">Xảy ra lỗi!</p>',
                icon: "error"
            })
        })
    }

    $scope.getAccount = (email) => {
        console.log("eamil", email);
        let param = {
            email: email
        }
        $http.get(url + "/get-user-by-email", { params: param }).then(response => {
            $scope.account = response.data
            console.log("$scope.account", $scope.account);

            if ($scope.account.role.roleName == 'BAC_SI') {
                let doctor = $scope.account.doctor
                $scope.formDoctor = {
                    image: doctor.image,
                    doctorId: doctor.doctorId,
                    fullName: doctor.fullName,
                    degrees: doctor.degrees,
                    phoneNumber: doctor.phoneNumber,
                    gender: doctor.gender,
                    address: doctor.address,
                    birthday: new Date(doctor.birthday),
                    signature: doctor.signature,
                    specialty: doctor.specialty,
                    deleted: doctor.deleted
                }
            }
            console.log("$scope.formDoctor bfff", $scope.formDoctor);

        })
    }

    $scope.urlImgDisplay = () => {
        let acc = $scope.account
        if (acc == null) return
        if (acc.role.roleName == "BAC_SI") {
            let filename = acc.doctor.image
            return url + "/imgDoctor/" + filename;
        } else {
            let filename = acc.dentalStaff.imageURL
            return url + "/imgStaff/" + filename;
        }
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

        $http.post(url + "/saveImage/tempFolder", form, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined,
                ...headers
            }
        }).then(response => {
            $scope.filenames.push(...response.data);
        }).catch(err => {
            console.log("error: ", err);
        })
    }

    $scope.urlImg = (filename) => {
        let image = url + "/image/tempFolder/" + filename
        return image
    }

    $scope.updateDoctor = () => {
        $scope.formDoctor.image = $scope.filenames[0]
        let requsetDoctorJSON = angular.toJson($scope.formDoctor)
        let doctorId = $scope.formDoctor.doctorId
        var requsetFileJSON = angular.toJson($scope.filenames)
        console.log("requsetFileJSON",requsetFileJSON);
        console.log("requsetDoctorJSON",requsetDoctorJSON);
        
        // $http.put(url + '/doctor/' + doctorId, requsetDoctorJSON).then(respone => {
        //     var requsetFileJSON = angular.toJson($scope.filenames)
        //     $http.post(url + '/move/tempFolder/imgDoctor', requsetFileJSON, {
        //         transformRequest: angular.identity,
        //         headers: {
        //             'Content-Type': undefined,
        //             ...headers
        //         }
        //     }).then(resp => {
        //         Swal.fire({
        //             title: "Thành công!",
        //             html: "Cập nhật thành công!",
        //             icon: "success"
        //         }).then(() => {
        //             $route.reload()
        //         })
        //     })
        // })
    }

    // $scope.changeImg = () => {
    //     const inputFile = document.getElementById('inputFile')
    //     inputFile.click()
    // }

    // $scope.uploadImg = (files) => {
    //     if (files == null) {
    //         alert("Upload hình chưa thành công")
    //         return
    //     }
    //     var form = new FormData();
    //     for (var i = 0; i < files.length; i++) {
    //         form.append("files", files[i]);
    //     }

    //     $http.post(url + "/saveImage/tempFolder", form, {
    //         transformRequest: angular.identity,
    //         headers: {
    //             'Content-Type': undefined,
    //             ...headers
    //         }
    //     }).then(response => {
    //         $scope.filenames.push(...response.data);
    //         let acc = $scope.account
    //         if (acc.role.roleName == 'BAC_SI') {
    //             $scope.formDoctor.image = $scope.filenames[0]
    //             let requsetDoctorJSON = angular.toJson($scope.formDoctor)
    //             let doctorId = $scope.formDoctor.doctorId
    //             $http.put(url + '/doctor/' + doctorId, requsetDoctorJSON).then(respone => {
    //                 var requsetFileJSON = angular.toJson($scope.filenames)
    //                 $http.post(url + '/move/tempFolder/imgDoctor', requsetFileJSON, {
    //                     transformRequest: angular.identity,
    //                     headers: {
    //                         'Content-Type': undefined,
    //                         ...headers
    //                     }
    //                 }).then(resp => {
    //                     Swal.fire({
    //                         title: "Thành công!",
    //                         html: "Cập nhật thành công!",
    //                         icon: "success"
    //                     }).then(() => {
    //                         $route.reload()
    //                     })
    //                 })
    //             })
    //         }
    //     }).catch(err => {
    //         console.log("error: ", err);
    //     })




    //     // $http.post(url + '/move/tempFolder/imgDoctor', form, {
    //     //     transformRequest: angular.identity,
    //     //     headers: {
    //     //         'Content-Type': undefined,
    //     //         ...headers
    //     //     }
    //     // }).then((response) => {
    //     //     Swal.fire({
    //     //         position:"top-end",
    //     //         title: "Thành công!",
    //     //         html: "Cập nhật thành công!",
    //     //         icon: "success"
    //     //     }).then(()=>{
    //     //         $scope.$apply()
    //     //     })
    //     // })


    // }


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
                    }],
                [
                    {
                        'direction': 'rtl'
                    }],
                [
                    {
                        'color': []
                    },
                    {
                        'background': []
                    }],
                [
                    {
                        'align': []
                    }],
                ['clean']
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
                var forms = document.getElementsByClassName('needs-validation');
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

        $('#degreesId').on('change', function () {
            $timeout(function () {
                $scope.formDoctor.degrees = $('#degreesId').val();
            });
        });
        $('#specialtyId').on('change', function () {
            $timeout(function () {
                $scope.formDoctor.specialtyId = $('#specialtyId').val();
            });
        });
        $('#doctorGender').on('change', function () {
            $timeout(function () {
                $scope.formDoctor.gender = $('#doctorGender').val();
            });
        });
    }

    $scope.getAccount(email)
    $scope.initData()

})