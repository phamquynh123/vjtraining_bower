$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});
$('#category').DataTable({
    processing: true,
    serverSide: true,
    ajax: $('#category').attr('data-url'),
    columns: [
        { data: 'id', name: 'id' },
        { data: 'title', name: 'title' },
        { data: 'parent', name: 'parent' },
        { data: 'created_at', name: 'created_at' },
        { data: 'action', name: 'action' },
    ],
});

$(document).on('submit', '#editProfile', function(e) {
    e.preventDefault();
    $.ajax({
        dataType: 'JSON',
        method: 'post',
        cache: false,
        contentType: false,
        processData: false,
        data: new FormData(this),
        url: route('editprofile'),
        success: function(response) {
            toastr.info(response.success);
            location.reload();
        },
        error:function(jqXHR, textStatus, errorThrown){
            if (jqXHR.responseJSON.errors.title !== undefined){
                toastr.error(jqXHR.responseJSON.errors.title[0]);
            }
        }
    })
});

$(document).on('submit', '#changepass', function(e) {
    e.preventDefault();
    $.ajax({
        dataType: 'JSON',
        method: 'post',
        cache: false,
        contentType: false,
        processData: false,
        data: new FormData(this),
        url: route('changepass'),
        success: function(response) {
            if (response.error == true) {
                toastr.error(response.success);
            } else {
                toastr.success(response.success);
                $('#changepass').reset();
            }
        },
        error:function(jqXHR, textStatus, errorThrown){
            if (jqXHR.responseJSON.errors.oldpass !== undefined){
                toastr.error(jqXHR.responseJSON.errors.oldpass[0]);
            }
            if (jqXHR.responseJSON.errors.newpass !== undefined){
                toastr.error(jqXHR.responseJSON.errors.newpass[0]);
            }
            if (jqXHR.responseJSON.errors.confirmpass !== undefined){
                toastr.error(jqXHR.responseJSON.errors.confirmpass[0]);
            }
        }
    })
})

