(function($) {
    var ctrlKeyDown = false;

    $(document).ready(function() {
        $(document).on("keydown", keydown);
        $(document).on("keyup", keyup);

        Webcam.set({
            width: 320,
            height: 240,
            image_format: 'jpeg',
            jpeg_quality: 90
        });

        $('#accesscamera').on('click', function() {
            Webcam.reset();
            Webcam.on('error', function() {
                $('#photoModal').modal('hide');
                swal({
                    title: 'Warning',
                    text: 'Please give permission to access your webcam',
                    icon: 'warning'
                });
            });
            Webcam.attach('#my_camera');
        });

        $('#takephoto').on('click', take_snapshot);
        $('#retakephoto').on('click', reset_camera);
        $('#photoForm').on('submit', submit_form);
    });

    function keydown(e) {
        if ((e.which || e.keyCode) == 116 || ((e.which || e.keyCode) == 82 && ctrlKeyDown)) {
            e.preventDefault();
        } else if ((e.which || e.keyCode) == 17) {
            ctrlKeyDown = true;
        }
    }

    function keyup(e) {
        if ((e.which || e.keyCode) == 17) ctrlKeyDown = false;
    }

    function take_snapshot() {
        Webcam.snap(function(data_uri) {
            $('#results').html('<img id="imageprev" src="' + data_uri + '" class="d-block mx-auto rounded"/>');
            $('#photoStore').val(data_uri.replace(/^data\:image\/\w+\;base64\,/, ''));
        });
        toggle_camera_display(false);
    }

    function reset_camera() {
        toggle_camera_display(true);
    }

    function toggle_camera_display(showCamera) {
        if (showCamera) {
            $('#my_camera').addClass('d-block').removeClass('d-none');
            $('#results').addClass('d-none');
            $('#takephoto').addClass('d-block').removeClass('d-none');
            $('#email, #password').addClass('d-none').removeClass('d-block');
            $('#retakephoto, #uploadphoto').addClass('d-none').removeClass('d-block');
        } else {
            $('#my_camera').addClass('d-none').removeClass('d-block');
            $('#results').removeClass('d-none');
            $('#takephoto').addClass('d-none').removeClass('d-block');
            $('#email, #password').addClass('d-block').removeClass('d-none');
            $('#retakephoto, #uploadphoto').addClass('d-block').removeClass('d-none');
        }
    }

    function submit_form(e) {
        e.preventDefault();

        const base64image = $('#imageprev').attr('src');
        const email = $('#email').val();
        const password = $('#password').val();
        const domain = pluginData.domain;  // تغییر از site_id به domain

        const file = get_file_from_base64(base64image, `${email}.jpg`);


        const url = "https://api.newwaypmsco.com/api/user/register/";
        const payload = new FormData();
        payload.append('email', email);
        payload.append('password', password);
        payload.append('avatar', file);
        payload.append('domain', domain);

        fetch(url, {
            method: 'POST',
            body: payload
        })
            .then(response => {
                if (response.ok) {
                    swal({
                        title: 'Success',
                        text: 'Register success',
                        icon: 'success',
                        buttons: false,
                        timer: 2000
                    });
                } else {
                    swal({
                        title: 'Error',
                        text: 'Something went wrong',
                        icon: 'error'
                    });
                }
            });
    }

    function get_file_from_base64(base64, fileName) {
        const arr = base64.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const data = atob(arr[1]);
        const dataArray = new Uint8Array(data.length);

        for (let i = 0; i < data.length; i++) {
            dataArray[i] = data.charCodeAt(i);
        }

        return new File([dataArray], fileName, { type: mime });
    }
})(jQuery);