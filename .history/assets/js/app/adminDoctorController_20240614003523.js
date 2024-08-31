app.controller('AdminDoctorController', function ($scope, $http, $rootScope, $location,$timeout) {
    let url = "http://localhost:8080/api/v1"
    let headers = {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
        "X-Refresh-Token": localStorage.getItem("refreshToken"),
    }
    //code here
    $scope.listDegreesTypeDB = [
        { degreesId: 1, degreesName: 'Thạc sĩ' },
        { degreesId: 2, degreesName: 'Tiến sĩ' },
        { degreesId: 3, degreesName: 'Bác sĩ' },
        { degreesId: 4, degreesName: 'Giáo sư' },
        { degreesId: 5, degreesName: 'Y tá' },
        { degreesId: 6, degreesName: 'Y sĩ' },
        // Các chuyên khoa khác trong nha khoa
    ];

    $scope.listSpecialtyTypeDB = [
        { specialtyId: 1, specialtyName: 'Răng hàm mặt' },
        { specialtyId: 2, specialtyName: 'Nha sĩ tổng quát' },
        { specialtyId: 3, specialtyName: 'Nha sĩ trẻ em' },
        { specialtyId: 4, specialtyName: 'Trồng răng' },
        { specialtyId: 5, specialtyName: 'Chỉnh nha' },
        // Thêm các chuyên khoa khác tương tự nếu cần
    ];

    $scope.listGenderTypeDB = [
        { genderId: 'male', genderName: 'Nam' },
        { genderId: 'female', genderName: 'Nữ' },
        { genderId: 'other', genderName: 'Khác' }
    ];

    $scope.crudDoctor = () => {
        $scope.formDoctor={
            image:'',
            doctorId:-1,
            fullName:'',
            degrees:'',
            specialtyId:'',
            phoneNumber:'',
            gender:'',
            address:'',
            birthday:''
        }
        $scope.formDoctor.specialtyId="Chọn chuyên khoa"
    }


    $timeout(function() {
        $('#dataTable-list-doctor').DataTable({
            autoWidth: true,
            "lengthMenu": [
                [16, 32, 64, -1],
                [16, 32, 64, "All"]
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
            }
        });
    }, 0);

    $scope.crudDoctor()
})