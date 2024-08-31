
app.controller('AdminPatientRecord', function ($scope, $http, $rootScope, $location, $timeout, processSelect2Service, TimezoneService, $route) {
    let url = "http://localhost:8081/api/v1/auth"
    let headers = {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
        "X-Refresh-Token": localStorage.getItem("refreshToken"),

    }

    $scope.listBillByAppointmentAndPatientDB = []
    $scope.listAPSDB = []
    $scope.appointments = []
    $scope.selectPatientIds = []
    $scope.selectDoctorIds = []
    $scope.selectedDates = ""

    $scope.appointmentIdParam = null
    $scope.patientIdParam = null

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

    $scope.reFresh = () => {
        $scope.selectedDates = ""
        $scope.selectPatientIds = []
        $scope.selectDoctorIds = []
        $scope.formPatientRecord = {
            patientId: null,
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

    $scope.getBillByAppointmentAndPatient = (appointmentIdParam, patientIdParam) => {
        var params = {
            appointmentId: appointmentIdParam,
            patientId: patientIdParam
        }
        $http.get(url + '/bill-by-appointment-and-patient', { params: params }).then(response => {
            $scope.listBillByAppointmentAndPatientDB = response.data
            console.log("$scope.BillByAppointmentAndPatientDB", $scope.listBillByAppointmentAndPatientDB);
        })
    }

    $scope.getBillByAppointment = (appointmentId, listBillByAppointmentAndPatientDB) => {
        let bill = listBillByAppointmentAndPatientDB.filter(bill => bill.appointment.appointmentId === appointmentId)
        return bill
    }

    $scope.getBillByPatient = (patientId, listBillByAppointmentAndPatientDB) => {

        let bill = listBillByAppointmentAndPatientDB.filter(bill => bill.appointment.patient.patientId === patientId)

        return bill
    }

    $scope.getAllAppointmentServiceExceptDeleted = () => {
        $http.get(url + '/appointment-service-except-deleted').then(response => {
            $scope.listAPSDB = response.data
        })
    }

    $scope.getAPSByAppointment = (appointmentId, listAPSDB) => {
        let services = listAPSDB.filter(service => service.appointment.appointmentId === appointmentId)
        return services
    }

    $scope.getTotalService = (appointmentId, listAPSDB) => {
        let services = listAPSDB.filter(service => service.appointment.appointmentId === appointmentId)
        let total = services.reduce((acc, s) => acc + (s.service.price * s.quantity), 0)
        return total
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

    // $scope.exportPDF = () => {

    //     pdfMake.fonts = {
    //         NimbusSans: {
    //             normal: "NimbusSanL-Reg.otf",
    //             bold: "NimbusSanL-Bol.otf",
    //             italics: "NimbusSanL-RegIta.otf",
    //             bolditalics: "NimbusSanL-BolIta.otf"
    //         }
    //     };

    //     const pdfContent = document.getElementById("pdfContent");
    //     if (!pdfContent) {
    //         console.error('Element not found!');
    //         return;
    //     }


    //     html2canvas(pdfContent, {
    //         useCORS: true,
    //         logging: true,
    //     }).then(function (canvas) {
    //         const imgData = canvas.toDataURL('image/png');
    //         const imgObj = {
    //             image: imgData,
    //             width: 600,
    //             style: {
    //                 alignment: "center"
    //             }
    //         };

    //         // Add the image to the pdfMake virtual file system
    //         pdfMake.vfs['imgData'] = imgData;

    //         console.log("imgObj", imgObj);

    //         const documentDefinition = {
    //             content: [
    //                 {
    //                     image: 'imgData',
    //                     width: 600,
    //                     style: {
    //                         alignment: "center"
    //                     }
    //                 }
    //             ],
    //             defaultStyle: {
    //                 font: "NimbusSans"
    //             },
    //             pageSize: "A4",
    //             pageOrientation: "landscape",
    //             pageMargins: [40, 60, 40, 60]
    //         };

    //         const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
    //         pdfDocGenerator.download();
    //     }).catch(function (error) {
    //         console.error("Error generating PDF:", error);
    //     });
    // };

    const canvasElement = document.getElementById("pdfContent");

    $scope.printPdf=(action)=> {
        const docDefinition = {
            content: [
                {
                    alignment: 'center',
                    text: 'PPRA',
                    style: 'header',
                    fontSize: 23,
                    bold: true,
                    margin: [0, 10],
                },
                {
                    margin: [0, 0, 0, 10],
                    layout: {
                        fillColor: function (rowIndex, node, columnIndex) {
                            return (rowIndex % 2 === 0) ? '#ebebeb' : '#f5f5f5';
                        }
                    },
                    table: {
                        widths: ['100%'],
                        heights: [20, 10],
                        body: [
                            [
                                {
                                    text: 'SETOR: ADMINISTRATIVO',
                                    fontSize: 9,
                                    bold: true,
                                }
                            ],
                            [
                                {
                                    text: 'FUNÇÃO: DIRETOR DE ENSINO',
                                    fontSize: 9,
                                    bold: true
                                }
                            ],
                        ],
                    }
                },
                {
                    style: 'tableExample',
                    layout: {
                        fillColor: function (rowIndex, node, columnIndex) {
                            return (rowIndex === 0) ? '#c2dec2' : null;
                        }
                    },
                    table: {
                        widths: ['30%', '10%', '25%', '35%'],
                        heights: [10, 10, 10, 10, 30, 10, 25],
                        headerRows: 1,
                        body: [
                            [
                                {
                                    text: 'AGENTE: Não Identificados',
                                    colSpan: 3,
                                    bold: true,
                                    fontSize: 9
                                },
                                {
                                },
                                {
                                },
                                {
                                    text: 'GRUPO: Grupo 1 - Riscos Físicos',
                                    fontSize: 9,
                                    bold: true
                                }
                            ],
                            [
                                {
                                    text: 'Limite de Tolerância:',
                                    fontSize: 9,
                                    bold: true
                                },
                                {
                                    text: 'Meio de Propagação:',
                                    colSpan: 3,
                                    fontSize: 9,
                                    bold: true
                                },
                                {
                                },
                                {
                                }
                            ],
                            [
                                {
                                    text: [
                                        'Frequência: ',
                                        {
                                            text: 'Habitual',
                                            bold: false
                                        }
                                    ],
                                    fontSize: 9,
                                    bold: true
                                },
                                {
                                    text: [
                                        'Classificação do Efeito: ',
                                        {
                                            text: 'Leve',
                                            bold: false
                                        }
                                    ],
                                    colSpan: 3,
                                    fontSize: 9,
                                    bold: true
                                },
                                {
                                },
                                {
                                }
                            ],
                            [
                                {
                                    text: 'Tempo de Exposição:',
                                    colSpan: 2,
                                    fontSize: 9,
                                    bold: true
                                },
                                {
                                },
                                {
                                    text: 'Medição:',
                                    colSpan: 2,
                                    fontSize: 9,
                                    bold: true
                                },
                                {
                                }
                            ],
                            [
                                {
                                    text: 'Fonte Geradora:',
                                    border: [true, true, false, false],
                                    colSpan: 2,
                                    fontSize: 9,
                                    bold: true
                                },
                                {
                                },
                                {
                                    text: 'Téc. Utilizada:',
                                    border: [false, true, true, false],
                                    colSpan: 2,
                                    fontSize: 9,
                                    bold: true
                                },
                                {
                                }
                            ],
                            [
                                {
                                    text: 'Conclusão:',
                                    border: [true, false, true, true],
                                    colSpan: 4,
                                    fontSize: 9,
                                    bold: true
                                },
                                {
                                },
                                {
                                },
                                {
                                }
                            ],
                            [
                                {
                                    text: 'EPIs/EPCs:',
                                    border: [true, true, false, true],
                                    colSpan: 3,
                                    fontSize: 9,
                                    bold: true
                                },
                                {
                                },
                                {
                                },
                                {
                                    text: 'CAs:',
                                    border: [false, true, true, true],
                                    fontSize: 9,
                                    bold: true
                                }
                            ],
                        ]
                    }
                }
            ]
        };

        if (action === 1) {
            pdfMake.createPdf(docDefinition).getDataUrl((dataURL) => {
                renderPDF(dataURL, document.getElementById('canvas'));
            });
        }
        else if (action === 2) {
            const pdf = createPdf(docDefinition);
            pdf.download('PPRA.pdf');
        }
    }

    function renderPDF(url, canvasContainer, options) {
        options = options || { scale: 1.4 };

        function renderPage(page) {
            const viewport = page.getViewport(options.scale);
            const wrapper = document.createElement("div");
            wrapper.className = "canvas-wrapper";
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const renderContext = {
                canvasContext: ctx,
                viewport: viewport
            };

            canvas.height = viewport.height;
            canvas.width = viewport.width;
            wrapper.appendChild(canvas)
            canvasContainer.appendChild(wrapper);

            page.render(renderContext);
        }

        function renderPages(pdfDoc) {
            for (let num = 1; num <= pdfDoc.numPages; num++)
                pdfDoc.getPage(num).then(renderPage);
        }

        PDFJS.disableWorker = true;
        PDFJS.getDocument(url).then(renderPages);
    }





    $scope.initializeUIComponents()
    $scope.initData()
    $scope.getListPatient()
    $scope.getListDoctor()
    $scope.getAllAppGroupByDate($scope.selectedDates, $scope.selectPatientIds, $scope.selectDoctorIds)
    $scope.getBillByAppointmentAndPatient($scope.appointmentIdParam, $scope.patientIdParam)
    $scope.getAllAppointmentServiceExceptDeleted()

})

