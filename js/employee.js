$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

$( document ).ready(function() {
    $('#exampleModal').modal({backdrop:'static', keyboard:false});
});

$('#employeetable').DataTable({
    processing: true,
    serverSide: true,
    ajax: $('#employeetable').attr('data-url'),
    columns: [
        { data: 'id', name: 'id' },
        { data: 'name', name: 'display_name' },
        { data: 'email', name: 'email' },
        { data: 'avatar', name: 'avatar' },
        { data: 'role', name: 'role' },
        { data: 'room', name: 'room' },
        { data: 'created_at', name: 'created_at' },
        { data: 'action', name: 'action' },
    ],
});

$(document).on('submit', '#add', function(e) {
    e.preventDefault();
    $.ajax({
        dataType: 'JSON',
        method: 'post',
        cache: false,
        contentType: false,
        processData: false,
        data: new FormData(this),
        url: route('nv.add'),
        success: function(response) {
            $('#employeetable').DataTable().ajax.reload(null, false);
            $('#ModalAdd').modal('hide');
            toastr.info(response.success);
        },
        error:function(jqXHR, textStatus, errorThrown){
            if (jqXHR.responseJSON.errors.name !== undefined){
                toastr.error(jqXHR.responseJSON.errors.name[0]);
            }
            if (jqXHR.responseJSON.errors.email !== undefined){
                toastr.error(jqXHR.responseJSON.errors.email[0]);
            }
            if (jqXHR.responseJSON.errors.password !== undefined){
                toastr.error(jqXHR.responseJSON.errors.password[0]);
            }
            if (jqXHR.responseJSON.errors.role_id !== undefined){
                toastr.error(jqXHR.responseJSON.errors.role_id[0]);
            }
            if (jqXHR.responseJSON.errors.room_id !== undefined){
                toastr.error(jqXHR.responseJSON.errors.room_id[0]);
            }
        }
    })
})

//reset  password one people
$(document).on('click', '.reset-pass-one', function() {
    var id = $(this).attr('data-id');
    $('#ResetPassOne').attr('data-id', id);
    $('#ResetPassOne')[0].reset();
})

$(document).on('submit', '#ResetPassOne', function(e) {
    e.preventDefault();
    var id = $(this).attr('data-id');
    $.ajax({
        dataType: 'JSON',
        method: 'post',
        cache: false,
        contentType: false,
        processData: false,
        data: new FormData(this),
        url: route('nv.resetPassOne', id),
        success: function(response) {
            $('#ModalResetPassOne').modal('hide');
            toastr.info(response.success);
        },
        error:function(jqXHR, textStatus, errorThrown){
            if (jqXHR.responseJSON.errors.password !== undefined){
                toastr.error(jqXHR.responseJSON.errors.password[0]);
            }
        }
    })
})

//reset-password-group
$(document).on('click', '.reset-password-group', function() {
    $.ajax({
        dataType: 'JSON',
        method: 'get',
        cache: false,
        contentType: false,
        processData: false,
        data: new FormData(this),
        url: route('nv.getinfoToChangePass'),
        success: function(response) {
            $.each(response, function($key, $value) {
                var html = `<tr>
                                <td><input type="checkbox" name="resetpass[]" value="` + $value['id'] + `"></td>
                                <td>` + $value['name'] + `</td>
                                <td>` + $value['email'] + `</td>
                            </tr>`;
                $('.tb-reset-pass').append(html);
            })
        },
    })
});

$(document).on('submit', '#ResetPassGroup', function(e) {
    e.preventDefault();
    $.ajax({
        dataType: 'JSON',
        method: 'post',
        cache: false,
        contentType: false,
        processData: false,
        data: new FormData(this),
        url: route('nv.resetPassGroup'),
        success: function(response) {
            $('#ResetPasswordGroup').modal('hide');
            toastr.info(response.success);
        },
        error:function(jqXHR, textStatus, errorThrown){
            if (jqXHR.responseJSON.errors.password !== undefined){
                toastr.error(jqXHR.responseJSON.errors.password[0]);
            }
        }
    })
})

// edit infor room and role of employee 
$(document).on('click', '.employee-edit', function(){
    var id = $(this).attr('data-id');
    $('#edit-infor-employee').attr('data-id', id);
    $.ajax({
        dataType: 'JSON',
        method: 'get',
        cache: false,
        contentType: false,
        processData: false,
        data: new FormData(this),
        url: route('nv.editinfo', id),
        success: function(response) {
            $('#role-edit').val(response.role_id);
            $('#room-edit').val(response.room_id);
        },
    })
});

$(document).on('submit', '#edit-infor-employee', function(e){
    e.preventDefault();
    var id = $(this).attr('data-id');
    $.ajax({
        dataType: 'JSON',
        method: 'post',
        cache: false,
        contentType: false,
        processData: false,
        data: new FormData(this),
        url: route('nv.updateinfo', id),
        success: function(response) {
            $('#ModalEditEmployeeInfor').modal('hide');
            $('#employeetable').DataTable().ajax.reload(null, false);
            toastr.info(response.success);
        },
        error:function(jqXHR, textStatus, errorThrown){
        }
    })
});

//list employee seen by manager
$('#employee-table-seen-by-manager').DataTable({
    processing: true,
    serverSide: true,
    ajax: $('#listEmployeeByRoom').attr('data-url'),
    columns: [
        { data: 'id', name: 'id' },
        { data: 'name', name: 'name' },
        { data: 'email', name: 'email' },
        { data: 'avatar', name: 'avatar' },
        { data: 'created_at', name: 'created_at' },
    ],
});