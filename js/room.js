$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

$( document ).ready(function() {
    $('#exampleModal').modal({backdrop:'static', keyboard:false});
});

$('#roomtable').DataTable({
    processing: true,
    serverSide: true,
    ajax: $('#roomtable').attr('data-url'),
    columns: [
        { data: 'id', name: 'id' },
        { data: 'display_name', name: 'display_name' },
        { data: 'description', name: 'description' },
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
        url: route('room.add'),
        success: function(response) {
            $('#roomtable').DataTable().ajax.reload(null, false);
            $('#ModalAdd').modal('hide');
            toastr.info(response.success);
        },
        error:function(jqXHR, textStatus, errorThrown){
            if (jqXHR.responseJSON.errors.name !== undefined){
                toastr.error(jqXHR.responseJSON.errors.name[0]);
            }
            if (jqXHR.responseJSON.errors.display_name !== undefined){
                toastr.error(jqXHR.responseJSON.errors.display_name[0]);
            }
            if (jqXHR.responseJSON.errors.description !== undefined){
                toastr.error(jqXHR.responseJSON.errors.description[0]);
            }
        }
    })
})

$(document).on('click', '.room-detail', function(e) {
    var id = $(this).attr('data-id');
    $('.content-detail-room').text('');
    e.preventDefault();
    $.ajax({
        dataType: 'JSON',
        method: 'get',
        cache: false,
        contentType: false,
        processData: false,
        data: new FormData(this),
        url: route('room.detail', id),
        success: function(response) {
            // $('.content-detail-room').text('');
            $.each(response.user, function(key, value) {
                var html = ` <tr>
                                <td>` + value.name + `</td>
                                <td>` + value.email + `</td>
                            </tr>`;
                $('.content-detail-room').append(html);
            })
            $('#name-room').html("<b>" + response.display_name + "</b>");
            $('#description').html("<b>" + response.description + "</b>");
        },
        error:function(jqXHR, textStatus, errorThrown){
        }
    })
})

$(document).on('click', '.room-edit', function(e) {
    var id = $(this).attr('data-id');
    $('#edit').attr('data-id', id);
    e.preventDefault();
    $.ajax({
        dataType: 'JSON',
        method: 'get',
        cache: false,
        contentType: false,
        processData: false,
        data: new FormData(this),
        url: route('room.edit', id),
        success: function(response) {
            $('#edit-display').val(response.display_name);
            $('#edit-name').val(response.name);
            $('#edit-description').val(response.description);
        },
        error:function(jqXHR, textStatus, errorThrown){
        }
    })
})

$(document).on('submit', '#edit', function(e) {
    var id = $(this).attr('data-id');
    e.preventDefault();
    $.ajax({
        dataType: 'JSON',
        method: 'post',
        cache: false,
        contentType: false,
        processData: false,
        data: new FormData(this),
        url: route('room.update', id),
        success: function(response) {
            toastr.info(response.success);
            $('#ModalEdit').modal('hide');
            $('#roomtable').DataTable().ajax.reload(null, false);
        },
        error:function(jqXHR, textStatus, errorThrown){
            if (jqXHR.responseJSON.errors.name !== undefined){
                toastr.error(jqXHR.responseJSON.errors.name[0]);
            }
            if (jqXHR.responseJSON.errors.display_name !== undefined){
                toastr.error(jqXHR.responseJSON.errors.display_name[0]);
            }
            if (jqXHR.responseJSON.errors.description !== undefined){
                toastr.error(jqXHR.responseJSON.errors.description[0]);
            }
        }
    })
})

$(document).on('click', '.remove', function() {
    Swal.fire({
        title: 'Xóa Phòng Ban Này?',
        text: "",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Xóa!'
    }).then((result) => {
        if (result.value) {
            var id = $(this).attr('data-id');
            $.ajax({
                dataType: 'JSON',
                method: 'get',
                cache: false,
                contentType: false,
                processData: false,
                data: new FormData(this),
                url: route('room.delete', id),
                success: function(response) {
                    toastr.info(response.success);
                    $('#ModalEdit').modal('hide');
                    $('#roomtable').DataTable().ajax.reload(null, false);
                },
            })
            Swal.fire(
                'Đã Xóa!',
                'Thành Công.'
            )
        }
    })
})