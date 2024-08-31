app.controller('AdminDoctorScheduleController', function ($scope, $http, $rootScope, $location) {
    let url = "http://localhost:8081/api/v1/auth"
    let headers = {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
        "X-Refresh-Token": localStorage.getItem("refreshToken"),
    }
    //code here
    $scope.currentTab = 1;
    $scope.selectTab = (tab, $event) => {
        $event.preventDefault()
        $scope.currentTab = tab;
    }
    $scope.isSelected = (tab) => {
        return $scope.currentTab === tab;
    }
    $scope.initDropAndDragTimeShift=()=>{
        // $('.drag-time-shift').draggable({ 
        //     appendTo: 'body',
        //     helper: 'clone'
        //   });
          
          $('#dropzone-time-shift').droppable({
            activeClass: 'active-time-shift',
            hoverClass: 'hover-time-shift',
            accept: ":not(.ui-sortable-helper)",
            drop: function (e, ui) {
              var $el = $('<div class="drop-item-time-shift"><details><summary>' + ui.draggable.text() + '</summary><div><label>More Data</label><input type="text" /></div></details></div>');
              $el.append($('<button type="button" class="btn btn-default btn-xs remove"><span class="glyphicon glyphicon-trash"></span></button>').click(function () { $(this).parent().detach(); }));
              $(this).append($el);
            }
          }).sortable({
            items: '.drop-item-time-shift',
            sort: function() {           
              $( this ).removeClass( "active-time-shift" );
            }
          });     
    }

    $scope.getListShift=()=>{
        $http.get(url+"/shift").then(respone =>{
            $scope.listShiftDB=respone.data
            console.log("$scope.listShiftDB",$scope.listShiftDB);  
        }).catch(err =>{
            console.log("error", err);
        })
    }

    $scope.initDropAndDragTimeShift()
    $scope.getListShift()
})