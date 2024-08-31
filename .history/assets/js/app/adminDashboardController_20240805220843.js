//console.log("AdminDashboardController");
app.controller('AdminDashboardController', function ($scope, $http, $rootScope, $location, API, adminBreadcrumbService) {
  let url = API.getBaseUrl();
  let headers = API.getHeaders();
  adminBreadcrumbService.generateBreadcrumb()

  $scope.today = moment(new Date()).format('YYYY-MM-DD');
  $scope.venueToday = 0
  $scope.venuePastToday = 0
  $scope.growthPercentage = 0

  $scope.fetchTotalRevenue = () => {
    $scope.getRevenue(null).then(response => {
      $scope.venueTotal = response.data;
    }).catch(error => {
      console.error('Error fetching total revenue:', error);
    });
  };

  $scope.fetchRevenueByDate = (date) => {
    $scope.getRevenue(date).then(response => {
      $scope.venueToday = response.data;
      $scope.fetchRevenueByPastDate(date)
    }).catch(error => {
      console.error('Error fetching revenue by date:', error);
    });
  };

  $scope.fetchRevenueByPastDate = (date) => {
    let pastDate = moment(date).subtract(1, 'days').format('YYYY-MM-DD')
    $scope.getRevenue(pastDate).then(response => {
      $scope.venuePastToday = response.data;
      $scope.getRevenueGrowthComparison()
    }).catch(error => {
      console.error('Error fetching revenue by date:', error);
    });
  };

  $scope.getRevenue = (today) => {
    let params = {};
    if (today) {
      params.date = today;
    }
    return $http.get(url + '/get-revenue', { params: params });
  };

  $scope.getRevenueGrowthComparison = () => {
    if ($scope.venueToday !== undefined && $scope.venuePastToday !== undefined) {
      let todayRevenue = $scope.venueToday;
      let pastRevenue = $scope.venuePastToday;
      let growthPercentage = ((todayRevenue - pastRevenue) / (pastRevenue == 0 ? 1 : pastRevenue)) * 100;
      $scope.isGrowing = growthPercentage > 0
      if (growthPercentage != 0) {
        $scope.growthPercentage = growthPercentage.toFixed(2);
      } else {
        $scope.growthPercentage = growthPercentage
      }
    }
  }

  $scope.getListAppointment = () => {
    $http.get(url + '/appointment').then(resp => {
      $scope.listAppointmentDB = resp.data
      const today = moment(new Date()).format('YYYY-MM-DD');
      const past = moment(today).subtract(1, 'days').format('YYYY-MM-DD');

      $scope.listAppointmentDBToday = $scope.listAppointmentDB.filter(app => app.createAt === today)
      $scope.listAppointmentDBPast = $scope.listAppointmentDB.filter(app => app.createAt === past)

      let todayLength = $scope.listAppointmentDBToday.length
      let pastLength = $scope.listAppointmentDBPast.length
      let caculator = ((todayLength - pastLength) / (pastLength == 0 ? 1 : pastLength)) * 100

      $scope.appFluctuate = Math.round(caculator);
      $scope.appFluctuate = parseFloat($scope.appFluctuate.toFixed(2))
    })
  }


  // $scope.getCategories = () => {
  //   const now = moment();
  //   const currentMonth = now.format('MM');
  //   const currentYear = now.format('YYYY');

  //   function generateDaysForMonth(month, year) {
  //     const startDate = moment.tz(`${year}-${month}-01`, 'YYYY-MM-DD', 'Asia/Bangkok');
  //     const endDate = startDate.clone().endOf('month');
  //     const days = [];

  //     for (let date = startDate; date <= endDate; date.add(1, 'days')) {
  //       // Định dạng ngày với múi giờ GMT+7
  //       days.push(date.format('DD/MM/YYYY [GMT+7]'));
  //     }
  //     return days;
  //   }

  //   const categories = generateDaysForMonth(currentMonth, currentYear);
  //   return categories
  // }

  $scope.getCategories = () => {
    const now = moment();
    const currentMonth = now.format('MM');
    const currentYear = now.format('YYYY');

    function generateDaysForMonth(month, year) {
      const startDate = moment.tz(`${year}-${month}-01`, 'YYYY-MM-DD', 'Asia/Bangkok');
      const endDate = startDate.clone().endOf('month');
      const days = [];

      for (let date = startDate; date <= endDate; date.add(1, 'days')) {
        days.push(date.format('YYYY-MM-DD'));
      }

      return days;
    }
    const categories = generateDaysForMonth(currentMonth, currentYear);
    console.log("categories", categories);

    return categories
  }

  $scope.getCategories()

  $scope.getRevenueAndDate = (monthParam) => {
    // monthParam có dang MM-yyyy
    let p = {
      moth: monthParam
    }
    return new Promise((resolve, reject) => {
      $http.get(url + '/get-revenue-and-date', { params: p }).then((response) => {
        resolve(response.data)
      }).catch((error) => {
        reject(error)
      })
    })

  }


  $scope.chartArea = (monthParam) => {
    $scope.getRevenueAndDate(monthParam).then(result => {
      console.log("result", result);
      let categories = result[0]
      let datas = result[1]
      const categoriesTimestamps = categories.map(date => new Date(date).getTime());
      const minTimestamp = Math.min(...categoriesTimestamps);
      const maxTimestamp = Math.max(...categoriesTimestamps);
      var areachart, areaChartOptions = {
        series: [
          {
            name: "Doanh thu",
            data: datas
          }

        ],
        chart: {
          type: "area",
          height: 350,
          background: "transparent",
          stacked: !0,
          toolbar: {
            show: !1
          },
          zoom: {
            enabled: !1
          }
        },
        theme: {
          mode: colors.chartTheme
        },
        xaxis: {
          type: "datetime",
          categories: categoriesTimestamps,
          labels: {
            formatter: function (value) {
              const date = moment(value);
              const day = date.format('DD');
              const month = date.format('MMMM');
              const monthsInVietnamese = {
                January: 'Tháng 1',
                February: 'Tháng 2',
                March: 'Tháng 3',
                April: 'Tháng 4',
                May: 'Tháng 5',
                June: 'Tháng 6',
                July: 'Tháng 7',
                August: 'Tháng 8',
                September: 'Tháng 9',
                October: 'Tháng 10',
                November: 'Tháng 11',
                December: 'Tháng 12'
              };
              return `${day}`;
              //  return `${day}-${monthsInVietnamese[month]}`;
            },
            show: !0,
            trim: !1,
            minHeight: void 0,
            maxHeight: 120,
            style: {
              colors: colors.secondaryColor,
              cssClass: "text-secondary",
              fontSize: '13px',
              fontFamily: base.defaultFontFamily
            }
          },
         // tickAmount: categoriesTimestamps.length,
          tickPlacement: 'on',
          //min: minTimestamp,
          //max: maxTimestamp,
          axisBorder: {
            show: !1
          },
          tooltip: {
            enabled: !1,
            offsetX: 0
          }
        },
        yaxis: {
          min: 0, // Giá trị thấp nhất
          max: 30000000, // Giá trị cao nhất (50 triệu đồng)
          tickAmount: 10, // Bước nhảy 
          labels: {
            formatter: function (value) {
              if (value === undefined || value === null) {
                return '0 đồng';
              }
              const millionValue = value / 1000000;
              return `${millionValue} triệu đồng`;
            },
            show: !0,
            trim: !1,
            offsetX: -10,
            minHeight: void 0,
            maxHeight: 120,
            style: {
              colors: colors.secondaryColor,
              cssClass: "text-secondary",
              fontSize: '13px',
              fontFamily: base.defaultFontFamily
            }
          }
        },
        markers: {
          size: 0,
          strokeColors: "#fff",
          strokeWidth: 0,
          strokeOpacity: .9,
          strokeDashArray: 0,
          fillOpacity: 1,
          discrete: [],
          shape: "circle",
          radius: 2,
          offsetX: 0,
          offsetY: 0,
          onClick: void 0,
          onDblClick: void 0,
          showNullDataPoints: !0,
          hover: {
            size: void 0,
            sizeOffset: 3
          }
        },
        colors: chartColors,
        dataLabels: {
          enabled: !1
        },
        stroke: {
          curve: "smooth",
          lineCap: "round",
          width: 0
        },
        fill: {
          type: "solid"
        },
        legend: {
          show: !1,
          position: "bottom",
          fontFamily: base.defaultFontFamily,
          fontWeight: 400,
          labels: {
            colors: colors.mutedColor,
            useSeriesColors: !1
          },
          markers: {
            width: 10,
            height: 10,
            strokeWidth: 0,
            strokeColor: "#fff",
            radius: 6
          },
          itemMargin: {
            horizontal: 10,
            vertical: 0
          },
          onItemClick: {
            toggleDataSeries: !0
          },
          onItemHover: {
            highlightDataSeries: !0
          }
        },
        grid: {
          show: !0,
          borderColor: colors.borderColor,
          strokeDashArray: 0,
          position: "back",
          xaxis: {
            lines: {
              show: !1
            }
          },
          yaxis: {
            lines: {
              show: !0
            }
          },
          row: {
            colors: void 0,
            opacity: .5
          },
          column: {
            colors: void 0,
            opacity: .5
          },
          padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        },
        tooltip: {
          style: {
            fontSize: "12px",
            fontFamily: base.defaultFontFamily
          }
        }
      },
        areachartCtn = document.querySelector("#areaChart");
      areachartCtn && (areachart = new ApexCharts(areachartCtn, areaChartOptions)).render();
    })

  }

  $scope.chartArea('07-2024');

  $scope.radialbarWidgetChart = function () {
    var radialbarWidgetChart, radialbarWidgetOptions = {
      series: [86],
      chart: {
        height: 120,
        type: "radialBar"
      },
      theme: {
        mode: colors.chartTheme
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: "70%"
          },
          track: {
            background: colors.borderColor
          },
          dataLabels: {
            show: !0,
            name: {
              fontSize: "0.875rem",
              fontWeight: 400,
              offsetY: -10,
              show: !1,
              color: colors.mutedColor,
              fontFamily: base.defaultFontFamily
            },
            value: {
              formatter: function (e) {
                return parseInt(e)
              },
              fontSize: "1.53125rem",
              fontWeight: 700,
              fontFamily: base.defaultFontFamily,
              offsetY: 10,
              show: !0,
              color: colors.headingColor
            },
            total: {
              show: !1,
              fontSize: "0.875rem",
              fontWeight: 400,
              offsetY: -10,
              label: "Percent",
              color: colors.mutedColor,
              fontFamily: base.defaultFontFamily
            }
          }
        }
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "diagonal2",
          shadeIntensity: .2,
          gradientFromColors: [extend.primaryColorLighter],
          gradientToColors: [base.primaryColor],
          inverseColors: !0,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [20, 100]
        }
      },
      stroke: {
        lineCap: "round"
      }
    },
      radialbarWidget = document.querySelector("#radialbarWidget");
    radialbarWidget && (radialbarWidgetChart = new ApexCharts(radialbarWidget, radialbarWidgetOptions)).render();
  }

  $scope.radialbarChart = function () {
    var radialbarChart, radialbarOptions = {
      series: [70],
      chart: {
        height: 200,
        type: "radialBar"
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: "75%"
          },
          track: {
            background: colors.borderColor
          },
          dataLabels: {
            show: !0,
            name: {
              fontSize: "0.875rem",
              fontWeight: 400,
              offsetY: -10,
              show: !0,
              color: colors.mutedColor,
              fontFamily: base.defaultFontFamily
            },
            value: {
              formatter: function (e) {
                return parseInt(e)
              },
              color: colors.headingColor,
              fontSize: "1.53125rem",
              fontWeight: 700,
              fontFamily: base.defaultFontFamily,
              offsetY: 5,
              show: !0
            },
            total: {
              show: !0,
              fontSize: "0.875rem",
              fontWeight: 400,
              offsetY: -10,
              label: "Percent",
              color: colors.mutedColor,
              fontFamily: base.defaultFontFamily
            }
          }
        }
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "diagonal2",
          shadeIntensity: .2,
          gradientFromColors: [extend.primaryColorLighter],
          gradientToColors: [extend.primaryColorDark],
          inverseColors: !0,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [20, 100]
        }
      },
      stroke: {
        lineCap: "round"
      },
      labels: ["CPU"]
    },
      radialbar = document.querySelector("#radialbar");
    radialbar && (radialbarChart = new ApexCharts(radialbar, radialbarOptions)).render();
  }

  $scope.barChartWidget = function () {
    var barChartWidget, barChartWidgetoptions = {
      series: [{
        name: "Revenue",
        data: [44, 55, 41, 64, 22, 43, 36]
      }, {
        name: "Total",
        data: [53, 32, 33, 52, 13, 44, 26]
      }, {
        name: "Cost",
        data: [13, 12, 13, 32, 3, 24, 18]
      }],
      chart: {
        type: "bar",
        height: 165,
        stacked: !0,
        zoom: {
          enabled: !0
        },
        toolbar: {
          show: !1
        }
      },
      theme: {
        mode: colors.chartTheme
      },
      dataLabels: {
        enabled: !1
      },
      plotOptions: {
        bar: {
          horizontal: !0,
          columnWidth: "20%",
          barHeight: "40%"
        }
      },
      xaxis: {
        categories: ["Monday", "Tuesday", "Wednesday", "Thusday", "Friday", "Saturday", "Sunday"],
        labels: {
          show: !1
        },
        axisBorder: {
          show: !1
        },
        axisTicks: {
          show: !1
        }
      },
      yaxis: {
        labels: {
          show: !1
        },
        reversed: !0
      },
      legend: {
        show: !1
      },
      fill: {
        opacity: 1,
        colors: chartColors
      },
      grid: {
        show: !1,
        padding: {
          top: -15,
          right: -15,
          bottom: -15,
          left: -10
        },
        position: "back"
      }
    },
      barChartWidgetCtn = document.querySelector("#barChartWidget");
    barChartWidgetCtn && (barChartWidget = new ApexCharts(barChartWidgetCtn, barChartWidgetoptions)).render();
  }

  $scope.initializeDragDropUploader = function () {
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

  $scope.initializeFormComponents = function () {
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
          format: 'MM/DD/YYYY'
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
  }


  $scope.radialbarWidgetChart();
  $scope.radialbarChart();
  $scope.barChartWidget();
  $scope.initializeDragDropUploader();
  $scope.initializeFormComponents();
  $scope.getListAppointment()
})

