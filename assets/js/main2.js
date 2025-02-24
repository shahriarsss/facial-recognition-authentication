(function($) {
    var ctrlKeyDown = false;

    $(document).ready(function() {
        console.log("main2.js loaded");
        $(document).on("keydown", keydown);
        $(document).on("keyup", keyup);

        Webcam.set({
            width: 320,
            height: 240,
            image_format: 'jpeg',
            jpeg_quality: 90
        });

        $('#accesscamera').on('click', function() {
            console.log("Access camera clicked");
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
        $('#photoForm').on('submit', handle_form_submission);

        console.log("Form submit handler attached");
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
        console.log("Taking snapshot");
        Webcam.snap(function(data_uri) {
            $('#results').html('<img id="imageprev" src="' + data_uri + '" class="d-block mx-auto rounded"/>');
            $('#photoStore').val(data_uri.replace(/^data\:image\/\w+\;base64\,/, ''));
        });
        toggle_camera(false);
    }

    function reset_camera() {
        toggle_camera(true);
    }

    function toggle_camera(showCamera) {
        if (showCamera) {
            $('#my_camera').removeClass('d-none').addClass('d-block');
            $('#results').addClass('d-none');
            $('#takephoto').removeClass('d-none').addClass('d-block');
            $('#retakephoto, #uploadphoto, #email, #password').addClass('d-none');
        } else {
            $('#my_camera').addClass('d-none');
            $('#results').removeClass('d-none');
            $('#takephoto').addClass('d-none');
            $('#retakephoto, #uploadphoto, #email, #password').removeClass('d-none').addClass('d-block');
        }
    }

    function handle_form_submission(e) {
        e.preventDefault();
        console.log("Form submitted");

        const base64image = $('#imageprev').attr('src');
        const email = $('#email').val();
        const password = $('#password').val();
        const domain = pluginData.domain;

        console.log("Form data before sending:", {email, password, domain, base64image});

        const payload = new FormData();
        payload.append('email', email);
        payload.append('password', password);
        payload.append('domain', domain);

        const fileData = get_file_from_base64(base64image, `${email}.jpg`);
        payload.append('avatar2', fileData);

        console.log("Payload ready to send");

        fetch("https://api.newwaypmsco.com/api/user/login/", {
            method: 'POST',
            body: payload
        })
            .then(response => {
                console.log("Response status:", response.status);
                if (response.ok) {
                    swal({
                        title: 'Success',
                        text: 'Login successful',
                        icon: 'success',
                        timer: 2000
                    }).then(() => refresh_page());
                } else {
                    response.text().then(text => {
                        console.log("Login error response:", text);
                        swal({
                            title: 'Error',
                            text: 'Something went wrong: ' + text,
                            icon: 'error'
                        });
                    });
                }
            })
            .catch(error => {
                console.error("Fetch error:", error);
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

    function refresh_page() {
        const currentUrl = window.location.href;
        const newUrl = currentUrl.includes('refreshed_by_js=true')
            ? currentUrl.replace('refreshed_by_js=true', '')
            : `${currentUrl}${currentUrl.includes('?') ? '&' : '?'}refreshed_by_js=true`;
        window.location.href = newUrl.replace(/[&?]$/, '');
    }
})(jQuery);