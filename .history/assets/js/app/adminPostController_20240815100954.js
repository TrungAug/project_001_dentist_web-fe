app.controller('AdminPostController', function ($scope, $http, $rootScope, $location, $timeout, API, $route, adminBreadcrumbService, processSelect2Service) {
    let url = API.getBaseUrl();
    let headers = API.getHeaders();
    adminBreadcrumbService.generateBreadcrumb()
    // code here
    
    $scope.initEditor=()=>{
        var editor = document.getElementById('editor')
        if (editor)
            {
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
    }

    $scope.initDataTable=()=>{
        $http.get(url+"/post-except-deleted",{headers:headers}).then(response=>{
            $scope.listPost=response.data
            console.log("$scope.listPost");
            
            if ($.fn.DataTable.isDataTable('#dataTable-list-post')) {
                $('#dataTable-list-post').DataTable().clear().destroy();
            }
            $(document).ready(function () {
                $('#dataTable-list-post').DataTable({
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

    $scope.urlImgPost = (filename) => {
        return url + "/imgPost/" + filename;
    }

    $scope.createPost=()=>{

    }
   
    $scope.initEditor()
    $scope.initDataTable()
})