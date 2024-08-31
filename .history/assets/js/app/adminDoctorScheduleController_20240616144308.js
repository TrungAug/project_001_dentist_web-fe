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
                var droppedText = ui.draggable.text(); // Lấy nội dung của phần tử đã thả vào

                // Kiểm tra xem dữ liệu đã tồn tại trong #dropzone chưa
                var isDuplicate = false;
                $(this).find('.drop-item').each(function () {
                    if ($(this).find('summary').text() === droppedText) {
                        isDuplicate = true;
                        return false; // Break out of each loop
                    }
                });
                if (!isDuplicate) {
                    var $el = $('<div class="drop-item"><details><summary>' + ui.draggable.text() + '</summary></details></div>');
                    $el.append($('<button type="button" class="btn btn-default btn-xs remove"><i class="bi bi-trash3" style="position: absolute;top: 0;right: 0;"></i></button>').click(function () { $(this).parent().detach(); }));
                    $(this).append($el);
                }else {
                    alert('Dữ liệu đã tồn tại trong #dropzone. Không thể thêm.');
                    Swal.fire({
                        title: "Thất bại!",
                        html: '<p class="text-danger">Dữ liệu đã tồn tại trong. Không thể thêm.!</p>',
                        icon: "error"
                    })
                }

            }
        }).sortable({
            items: '.drop-item',
            sort: function () {
                // gets added unintentionally by droppable interacting with sortable
                // using connectWithSortable fixes this, but doesn't allow you to customize active/hoverClass options
                $(this).removeClass("active-time-shift");
            }
        });
    }

    $scope.getTimeShift = () => {
        var dropItems = $('#dropzone').find('.drop-item');
        var dropContents = dropItems.map(function () {
            return $(this).find('summary').text();
        }).get();
        console.log("Dữ liệu đã thả vào #dropzone:", dropContents);
    }

    $scope.getListShift()
    $scope.selectTimeShift()
})