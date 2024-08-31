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
    $scope.getListShift = () => {
        $http.get(url + "/shift").then(respone => {
            $scope.listShiftDB = respone.data
            console.log("$scope.listShiftDB", $scope.listShiftDB);
        }).catch(err => {
            console.log("error", err);
        })
    }

    $scope.selectTimeShift = () => {
        $('.drag').draggable({
            appendTo: 'body',
            helper: 'clone'
        });

        $('#dropzone').droppable({
            activeClass: 'active',
            hoverClass: 'hover',
            accept: ":not(.ui-sortable-helper)", // Reject clones generated by sortable
            drop: function (e, ui) {
                var $el = $('<div class="drop-item"><details><summary>' + ui.draggable.text() + '</summary><div><label>More Data</label><input type="text" /></div></details></div>');
                $el.append($('<button type="button" class="btn btn-default btn-xs remove"><span class="glyphicon glyphicon-trash"></span></button>').click(function () { $(this).parent().detach(); }));
                $(this).append($el);
            }
        }).sortable({
            items: '.drop-item',
            sort: function () {
                // gets added unintentionally by droppable interacting with sortable
                // using connectWithSortable fixes this, but doesn't allow you to customize active/hoverClass options
                $(this).removeClass("active");
            }
        });
    }



    $scope.getListShift()
    $scope.selectTimeShift()
})