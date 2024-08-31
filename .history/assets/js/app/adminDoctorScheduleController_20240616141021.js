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
    
    $scope.getListShift=()=>{
        $http.get(url+"/shift").then(respone =>{
            $scope.listShiftDB=respone.data
            console.log("$scope.listShiftDB",$scope.listShiftDB);  
        }).catch(err =>{
            console.log("error", err);
        })
    }


    $scope.getListShift()
})