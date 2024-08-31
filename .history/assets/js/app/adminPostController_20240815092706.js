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
   
    $scope.initEditor()
})