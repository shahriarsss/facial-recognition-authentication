(function ($) {
    var ctrlKeyDown = false;
    var otpRequested = false;
    var timerInterval;

    $(document).ready(function () {
        $(document).on("keydown", keydown);
        $(document).on("keyup", keyup);

        Webcam.set({
            width: 320,
            height: 240,
            image_format: 'jpeg',
            jpeg_quality: 90
        });

        $('#accesscamera').on('click', function () {
            Webcam.reset();
            Webcam.on('error', function () {
                $('#photoModal').modal('hide');
                swal({
                    title: 'Warning',
                    text: 'Please give permission to access your webcam',
                    icon: 'warning'
                });
            });
            Webcam.attach('#my_camera');
            $('#camera-guide').html('<p>Please position your face close to the camera so it fills most of the frame.</p><a href="#" id="manage-account-link">Manage Your Account</a>');
        });

        $('#takephoto').on('click', take_snapshot);
        $('#retakephoto').on('click', reset_camera);
        $('#photoForm').on('submit', handle_form_submission);

        $(document).on('click', '#manage-account-link', function (e) {
            e.preventDefault();
            $('#manage-account-form').removeClass('d-none');
            $('#my_camera, #results, #takephoto, #retakephoto, #uploadphoto, #email, #password').addClass('d-none');
        });

        $('#manageAction').on('change', function () {
            if ($(this).val() === 'change_password') {
                $('#newPassword').removeClass('d-none');
            } else {
                $('#newPassword').addClass('d-none');
            }
            if ($(this).val() === 'change_photo') {
                Webcam.attach('#my_camera');
                $('#my_camera').removeClass('d-none');
                $('#takephoto').removeClass('d-none');
            } else {
                $('#my_camera, #takephoto').addClass('d-none');
            }
        });

        $('#otpCode').on('input', function () {
            if ($(this).val().length === 6) {
                $('#submitAction').prop('disabled', false);
            } else {
                $('#submitAction').prop('disabled', true);
            }
        });

        $('#accountForm').on('submit', manage_account);

        // چک کردن 2FA و اجرای تشخیص چهره قبل از اون
        if (pluginData.is_wordfence_2fa_active === 'true') {
            console.log('Wordfence 2FA فعاله، ولی تشخیص چهره اول اجرا می‌شه');
            // مخفی کردن فرم 2FA تا تشخیص چهره تموم شه
            setTimeout(() => {
                if ($('.wf-form-2fa').length) {
                    $('.wf-form-2fa').hide();
                }
            }, 500);
        }
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
        Webcam.snap(function (data_uri) {
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
        const base64image = $('#imageprev').attr('src');
        const email = $('#email').val();
        const password = $('#password').val();
        const domain = pluginData.domain;
        const payload = new FormData();
        payload.append('email', email);
        payload.append('password', password);
        payload.append('domain', domain);
        const fileData = get_file_from_base64(base64image, `${email}.jpg`);
        payload.append('avatar2', fileData);

        fetch("https://api.newwaypmsco.com/api/user/login/", {
            method: 'POST',
            body: payload
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        if (data.avatar2) {
                            swal({title: 'Image Error', text: data.avatar2[0], icon: 'error'});
                        } else if (data.message === 'Invalid Login Details!') {
                            swal({title: 'Login Error', text: 'Incorrect email or password.', icon: 'error'});
                        } else if (data.message === 'Domain mismatch') {
                            swal({title: 'Domain Error', text: 'This user is not registered for this domain.', icon: 'error'});
                        } else if (data.message === 'Face Not Recognized') {
                            swal({title: 'Recognition Error', text: 'Your face was not recognized. Please try again.', icon: 'error'});
                        } else if (data.message === 'Please verify your email first.') {
                            swal({title: 'Email Error', text: 'Please verify your email first.', icon: 'error'});
                        } else {
                            swal({title: 'Error', text: 'Something went wrong during login.', icon: 'error'});
                        }
                        throw new Error('Login failed');
                    });
                }
                return response.json();
            })
            .then(data => {
                if (data.success === 'True') {
                    swal({
                        title: 'Success',
                        text: 'Login successful!',
                        icon: 'success',
                        timer: 2000
                    }).then(() => {
                        if (pluginData.is_wordfence_2fa_active === 'true') {
                            // اگه 2FA فعال بود، فرم Wordfence رو نشون بده
                            $('.wf-form-2fa').show();
                            console.log('تشخیص چهره تموم شد، حالا 2FA اجرا می‌شه');
                        } else {
                            refresh_page(); // اگه 2FA نبود، مستقیم رفرش کن
                        }
                    });
                }
            })
            .catch(error => {
                console.error("Fetch error:", error);
            });
    }

    function manage_account(e) {
        e.preventDefault();
        const email = $('#manageEmail').val();
        const action = $('#manageAction').val();
        const newPassword = $('#newPassword').val();
        const otpCode = $('#otpCode').val();
        const base64image = $('#imageprev').attr('src');
        const file = base64image ? get_file_from_base64(base64image, `${email}.jpg`) : null;

        const payload = new FormData();
        payload.append('email', email);
        payload.append('action', action);
        if (newPassword) payload.append('new_password', newPassword);
        if (otpCode) payload.append('otp_code', otpCode);
        if (file) {
            if (action === 'change_photo' && !$('#newPhotoStore').val()) {
                payload.append('avatar', file);
            } else if (action === 'change_photo' && $('#newPhotoStore').val()) {
                payload.append('new_avatar', file);
            } else if (action === 'change_password' || action === 'delete_account') {
                payload.append('avatar', file);
            }
        }

        if (!otpRequested) {
            swal({
                title: "Sending OTP...",
                text: "Please wait while we send your one-time password.",
                icon: "info",
                buttons: false,
                closeOnClickOutside: false
            });
            fetch("https://api.newwaypmsco.com/api/user/account-management/", {
                method: 'POST',
                body: payload
            })
                .then(response => response.json())
                .then(data => {
                    swal.close();
                    if (data.message) {
                        $('#otp-section').removeClass('d-none');
                        $('#submitAction').text('Confirm');
                        $('#submitAction').prop('disabled', true);
                        otpRequested = true;
                        startTimer(data.expiry_seconds);
                        swal("Check Your Email", data.message, "success");
                    } else {
                        swal("Error", data.error, "error");
                    }
                })
                .catch(error => {
                    swal.close();
                    swal("Error", "Failed to send OTP.", "error");
                });
        } else {
            if ((action === 'change_password' || action === 'delete_account') && !base64image) {
                $('#manage-account-form').html(`
                    <form id="${action === 'change_password' ? 'changePasswordForm' : 'deleteAccountForm'}">
                        <input type="email" id="manageEmail" name="email" value="${email}" readonly class="form-control mb-2">
                        ${action === 'change_password' ? '<input type="password" id="newPassword" name="new_password" placeholder="New Password" value="' + newPassword + '" required class="form-control mb-2">' : ''}
                        <input type="text" id="otpCode" name="otp_code" placeholder="Enter OTP" value="${otpCode}" required class="form-control mb-2">
                        <div class="d-flex align-items-center mb-2">
                            <div id="my_camera" class="rounded overflow-hidden" style="width: 160px; height: 120px;"></div>
                            <div class="ml-2" style="width: 160px;">
                                <button type="button" id="takephoto" class="btn btn-warning w-100 mb-2">Capture Photo</button>
                                <button type="button" id="retakePhoto" class="btn btn-warning w-100 mb-2 d-none">Retake</button>
                            </div>
                        </div>
                        <div id="results" class="mb-2"></div>
                        <input type="hidden" id="photoStore" name="photoStore" value="">
                        <button type="submit" id="submitAction" class="btn btn-warning w-100">${action === 'change_password' ? 'Confirm' : 'Confirm Deletion'}</button>
                    </form>
                `).removeClass('d-none');
                Webcam.attach('#my_camera');
                $('#my_camera').removeClass('d-none');

                $('#takephoto').on('click', function () {
                    Webcam.snap(function (data_uri) {
                        $('#results').html('<img id="imageprev" src="' + data_uri + '" class="d-block mx-auto rounded" style="width: 160px; height: 120px;"/>');
                        $('#photoStore').val(data_uri.replace(/^data\:image\/\w+\;base64\,/, ''));
                        $('#my_camera').addClass('d-none');
                        $('#takephoto').addClass('d-none');
                        $('#retakePhoto').removeClass('d-none');
                    });
                });

                $('#retakePhoto').on('click', function () {
                    $('#results').html('');
                    $('#my_camera').removeClass('d-none');
                    $('#takephoto').removeClass('d-none');
                    $('#retakePhoto').addClass('d-none');
                    Webcam.attach('#my_camera');
                });

                $('#otpCode').on('input', function () {
                    if ($(this).val().length === 6) {
                        $('#submitAction').prop('disabled', false);
                    } else {
                        $('#submitAction').prop('disabled', true);
                    }
                });

                $(`#${action === 'change_password' ? 'changePasswordForm' : 'deleteAccountForm'}`).on('submit', function (e) {
                    e.preventDefault();
                    const email = $('#manageEmail').val();
                    const newPassword = $('#newPassword').val();
                    const otpCode = $('#otpCode').val();
                    const base64image = $('#imageprev').attr('src');
                    const file = base64image ? get_file_from_base64(base64image, `${email}.jpg`) : null;
                    const payload = new FormData();
                    payload.append('email', email);
                    payload.append('action', action);
                    if (newPassword) payload.append('new_password', newPassword);
                    payload.append('otp_code', otpCode);
                    if (file) payload.append('avatar', file);

                    fetch("https://api.newwaypmsco.com/api/user/confirm-action/", {
                        method: 'POST',
                        body: payload
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data.message) {
                                if (action === 'delete_account') {
                                    swal({
                                        title: "Account Deleted",
                                        text: "Your account has been deleted. Register a new one?",
                                        icon: "success",
                                        buttons: { cancel: "Close", register: { text: "Register Now", value: "register" } }
                                    }).then((value) => {
                                        if (value === "register") {
                                            $('#manage-account-form').html(`
                                                <form id="registerForm">
                                                    <input type="email" id="newEmail" name="email" placeholder="New Email" required class="form-control mb-2">
                                                    <input type="password" id="newPassword" name="password" placeholder="New Password" required class="form-control mb-2">
                                                    <div id="my_camera" class="d-block mx-auto rounded overflow-hidden mb-2"></div>
                                                    <button type="button" id="takePhoto" class="btn btn-warning w-100 mb-2">Take Photo</button>
                                                    <div id="results" class="mb-2"></div>
                                                    <button type="button" id="retakePhoto" class="btn btn-warning w-100 mb-2 d-none">Retake</button>
                                                    <input type="hidden" id="photoStore" name="photoStore" value="">
                                                    <button type="submit" id="submitRegister" class="btn btn-warning w-100" disabled>Register</button>
                                                </form>
                                            `).removeClass('d-none');
                                            Webcam.attach('#my_camera');
                                            $('#my_camera').removeClass('d-none');

                                            $('#takePhoto').on('click', function () {
                                                Webcam.snap(function (data_uri) {
                                                    $('#results').html('<img id="imageprev" src="' + data_uri + '" class="d-block mx-auto rounded"/>');
                                                    $('#photoStore').val(data_uri.replace(/^data\:image\/\w+\;base64\,/, ''));
                                                    $('#my_camera').addClass('d-none');
                                                    $('#takePhoto').addClass('d-none');
                                                    $('#retakePhoto').removeClass('d-none');
                                                    $('#submitRegister').prop('disabled', false);
                                                });
                                            });

                                            $('#retakePhoto').on('click', function () {
                                                $('#results').html('');
                                                $('#my_camera').removeClass('d-none');
                                                $('#takePhoto').removeClass('d-none');
                                                $('#retakePhoto').addClass('d-none');
                                                Webcam.attach('#my_camera');
                                            });

                                            $('#registerForm').on('submit', function (e) {
                                                e.preventDefault();
                                                const newEmail = $('#newEmail').val();
                                                const newPassword = $('#newPassword').val();
                                                const base64image = $('#imageprev').attr('src');
                                                const file = base64image ? get_file_from_base64(base64image, `${newEmail}.jpg`) : null;
                                                const payload = new FormData();
                                                payload.append('email', newEmail);
                                                payload.append('password', newPassword);
                                                payload.append('avatar', file);
                                                payload.append('domain', pluginData.domain);

                                                fetch("https://api.newwaypmsco.com/api/user/register/", {
                                                    method: 'POST',
                                                    body: payload
                                                })
                                                    .then(response => {
                                                        if (!response.ok) {
                                                            return response.json().then(data => {
                                                                throw new Error(data.email || data.avatar || data.domain || "Registration failed");
                                                            });
                                                        }
                                                        return response.json();
                                                    })
                                                    .then(data => {
                                                        swal("Success", "Registration successful! Please verify your email to complete the process.", "success").then(() => {
                                                            $('#photoModal').modal('hide');
                                                        });
                                                    })
                                                    .catch(error => {
                                                        swal("Error", error.message, "error");
                                                    });
                                            });
                                        } else {
                                            $('#photoModal').modal('hide');
                                        }
                                    });
                                } else {
                                    swal("Success", data.message, "success").then(() => {
                                        $('#manage-account-form').addClass('d-none');
                                        otpRequested = false;
                                        $('#otp-section').addClass('d-none');
                                        $('#submitAction').text('Submit');
                                        $('#submitAction').prop('disabled', false);
                                        clearInterval(timerInterval);
                                        $('#my_camera, #takephoto').addClass('d-none');
                                    });
                                }
                            } else if (data.error === "OTP has expired or is invalid.") {
                                swal({
                                    title: "OTP Expired",
                                    text: "Your OTP has expired. Request a new one?",
                                    icon: "warning",
                                    buttons: { cancel: "Close", resend: { text: "Resend OTP", value: "resend" } }
                                }).then((value) => {
                                    if (value === "resend") {
                                        const resendPayload = new FormData();
                                        resendPayload.append('email', email);
                                        resendPayload.append('action', action);
                                        if (newPassword) resendPayload.append('new_password', newPassword);

                                        swal({
                                            title: "Sending OTP...",
                                            text: "Please wait while we send a new OTP.",
                                            icon: "info",
                                            buttons: false,
                                            closeOnClickOutside: false
                                        });
                                        fetch("https://api.newwaypmsco.com/api/user/account-management/", {
                                            method: 'POST',
                                            body: resendPayload
                                        })
                                            .then(response => response.json())
                                            .then(data => {
                                                swal.close();
                                                if (data.message) {
                                                    startTimer(data.expiry_seconds);
                                                    swal("Check Your Email", data.message, "success").then(() => {
                                                        $('#otpCode').val('');
                                                        $('#submitAction').prop('disabled', true);
                                                    });
                                                } else {
                                                    swal("Error", data.error, "error");
                                                }
                                            });
                                    } else {
                                        $('#manage-account-form').addClass('d-none');
                                        otpRequested = false;
                                    }
                                });
                            } else {
                                swal("Error", data.error, "error");
                            }
                        });
                });
                return;
            } else if (action === 'change_photo' && !base64image) {
                $('#manage-account-form').html(`
                    <form id="changePhotoForm">
                        <input type="email" id="manageEmail" name="email" value="${email}" readonly class="form-control mb-2">
                        <input type="text" id="otpCode" name="otp_code" placeholder="Enter OTP" value="${otpCode}" required class="form-control mb-2">
                        <div class="d-flex align-items-center mb-2">
                            <div id="my_camera" class="rounded overflow-hidden" style="width: 160px; height: 120px;"></div>
                            <div class="ml-2" style="width: 160px;">
                                <button type="button" id="takephoto" class="btn btn-warning w-100 mb-2">Capture Photo</button>
                                <button type="button" id="retakePhoto" class="btn btn-warning w-100 mb-2 d-none">Retake</button>
                            </div>
                        </div>
                        <div id="results" class="mb-2"></div>
                        <input type="hidden" id="photoStore" name="photoStore" value="">
                        <button type="submit" id="submitAction" class="btn btn-warning w-100">Verify Face</button>
                    </form>
                `).removeClass('d-none');
                Webcam.attach('#my_camera');
                $('#my_camera').removeClass('d-none');

                $('#takephoto').on('click', function () {
                    Webcam.snap(function (data_uri) {
                        $('#results').html('<img id="imageprev" src="' + data_uri + '" class="d-block mx-auto rounded" style="width: 160px; height: 120px;"/>');
                        $('#photoStore').val(data_uri.replace(/^data\:image\/\w+\;base64\,/, ''));
                        $('#my_camera').addClass('d-none');
                        $('#takephoto').addClass('d-none');
                        $('#retakePhoto').removeClass('d-none');
                    });
                });

                $('#retakePhoto').on('click', function () {
                    $('#results').html('');
                    $('#my_camera').removeClass('d-none');
                    $('#takephoto').removeClass('d-none');
                    $('#retakePhoto').addClass('d-none');
                    Webcam.attach('#my_camera');
                });

                $('#otpCode').on('input', function () {
                    if ($(this).val().length === 6) {
                        $('#submitAction').prop('disabled', false);
                    } else {
                        $('#submitAction').prop('disabled', true);
                    }
                });

                $('#changePhotoForm').on('submit', function (e) {
                    e.preventDefault();
                    const email = $('#manageEmail').val();
                    const otpCode = $('#otpCode').val();
                    const base64image = $('#imageprev').attr('src');
                    const file = base64image ? get_file_from_base64(base64image, `${email}.jpg`) : null;
                    const payload = new FormData();
                    payload.append('email', email);
                    payload.append('action', 'change_photo');
                    payload.append('otp_code', otpCode);
                    if (file && !$('#newPhotoStore').val()) {
                        payload.append('avatar', file);
                    } else if (file && $('#newPhotoStore').val()) {
                        payload.append('new_avatar', file);
                    }

                    fetch("https://api.newwaypmsco.com/api/user/confirm-action/", {
                        method: 'POST',
                        body: payload
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data.message === "Face verified. Please upload a new photo.") {
                                $('#manage-account-form').html(`
                                    <form id="changePhotoFormNew">
                                        <input type="email" id="manageEmail" name="email" value="${email}" readonly class="form-control mb-2">
                                        <input type="text" id="otpCode" name="otp_code" value="${otpCode}" readonly class="form-control mb-2">
                                        <div class="d-flex align-items-center mb-2">
                                            <div id="my_camera" class="rounded overflow-hidden" style="width: 160px; height: 120px;"></div>
                                            <div class="ml-2" style="width: 160px;">
                                                <button type="button" id="takephoto" class="btn btn-warning w-100 mb-2">Capture New Photo</button>
                                                <button type="button" id="retakePhoto" class="btn btn-warning w-100 mb-2 d-none">Retake</button>
                                            </div>
                                        </div>
                                        <div id="results" class="mb-2"></div>
                                        <input type="hidden" id="newPhotoStore" name="newPhotoStore" value="true">
                                        <button type="submit" id="submitAction" class="btn btn-warning w-100">Confirm Change</button>
                                    </form>
                                `).removeClass('d-none');
                                Webcam.attach('#my_camera');
                                $('#my_camera').removeClass('d-none');

                                $('#takephoto').on('click', function () {
                                    Webcam.snap(function (data_uri) {
                                        $('#results').html('<img id="imageprev" src="' + data_uri + '" class="d-block mx-auto rounded" style="width: 160px; height: 120px;"/>');
                                        $('#newPhotoStore').val(data_uri.replace(/^data\:image\/\w+\;base64\,/, ''));
                                        $('#my_camera').addClass('d-none');
                                        $('#takephoto').addClass('d-none');
                                        $('#retakePhoto').removeClass('d-none');
                                    });
                                });

                                $('#retakePhoto').on('click', function () {
                                    $('#results').html('');
                                    $('#my_camera').removeClass('d-none');
                                    $('#takephoto').removeClass('d-none');
                                    $('#retakePhoto').addClass('d-none');
                                    Webcam.attach('#my_camera');
                                });

                                $('#changePhotoFormNew').on('submit', function (e) {
                                    e.preventDefault();
                                    const email = $('#manageEmail').val();
                                    const otpCode = $('#otpCode').val();
                                    const base64image = $('#imageprev').attr('src');
                                    const file = base64image ? get_file_from_base64(base64image, `${email}.jpg`) : null;
                                    const payload = new FormData();
                                    payload.append('email', email);
                                    payload.append('action', 'change_photo');
                                    payload.append('otp_code', otpCode);
                                    if (file) payload.append('new_avatar', file);

                                    fetch("https://api.newwaypmsco.com/api/user/confirm-action/", {
                                        method: 'POST',
                                        body: payload
                                    })
                                        .then(response => response.json())
                                        .then(data => {
                                            if (data.message) {
                                                swal("Success", data.message, "success").then(() => {
                                                    $('#manage-account-form').addClass('d-none');
                                                    otpRequested = false;
                                                    $('#otp-section').addClass('d-none');
                                                    $('#submitAction').text('Submit');
                                                    $('#submitAction').prop('disabled', false);
                                                    clearInterval(timerInterval);
                                                    $('#my_camera, #takephoto').addClass('d-none');
                                                });
                                            } else {
                                                swal("Error", data.error, "error");
                                            }
                                        });
                                });
                            } else if (data.message) {
                                swal("Success", data.message, "success").then(() => {
                                    $('#manage-account-form').addClass('d-none');
                                    otpRequested = false;
                                    $('#otp-section').addClass('d-none');
                                    $('#submitAction').text('Submit');
                                    $('#submitAction').prop('disabled', false);
                                    clearInterval(timerInterval);
                                    $('#my_camera, #takephoto').addClass('d-none');
                                });
                            } else if (data.error === "OTP has expired or is invalid.") {
                                swal({
                                    title: "OTP Expired",
                                    text: "Your OTP has expired. Request a new one?",
                                    icon: "warning",
                                    buttons: { cancel: "Close", resend: { text: "Resend OTP", value: "resend" } }
                                }).then((value) => {
                                    if (value === "resend") {
                                        const resendPayload = new FormData();
                                        resendPayload.append('email', email);
                                        resendPayload.append('action', action);

                                        swal({
                                            title: "Sending OTP...",
                                            text: "Please wait while we send a new OTP.",
                                            icon: "info",
                                            buttons: false,
                                            closeOnClickOutside: false
                                        });
                                        fetch("https://api.newwaypmsco.com/api/user/account-management/", {
                                            method: 'POST',
                                            body: resendPayload
                                        })
                                            .then(response => response.json())
                                            .then(data => {
                                                swal.close();
                                                if (data.message) {
                                                    startTimer(data.expiry_seconds);
                                                    swal("Check Your Email", data.message, "success").then(() => {
                                                        $('#otpCode').val('');
                                                        $('#submitAction').prop('disabled', true);
                                                    });
                                                } else {
                                                    swal("Error", data.error, "error");
                                                }
                                            });
                                    } else {
                                        $('#manage-account-form').addClass('d-none');
                                        otpRequested = false;
                                    }
                                });
                            } else {
                                swal("Error", data.error, "error");
                            }
                        });
                });
                return;
            }
            fetch("https://api.newwaypmsco.com/api/user/confirm-action/", {
                method: 'POST',
                body: payload
            })
                .then(response => response.json())
                .then(data => {
                    if (data.message) {
                        if (action === 'delete_account') {
                            swal({
                                title: "Account Deleted",
                                text: "Your account has been deleted. Register a new one?",
                                icon: "success",
                                buttons: { cancel: "Close", register: { text: "Register Now", value: "register" } }
                            }).then((value) => {
                                if (value === "register") {
                                    $('#manage-account-form').html(`
                                        <form id="registerForm">
                                            <input type="email" id="newEmail" name="email" placeholder="New Email" required class="form-control mb-2">
                                            <input type="password" id="newPassword" name="password" placeholder="New Password" required class="form-control mb-2">
                                            <div id="my_camera" class="d-block mx-auto rounded overflow-hidden mb-2"></div>
                                            <button type="button" id="takePhoto" class="btn btn-warning w-100 mb-2">Take Photo</button>
                                            <div id="results" class="mb-2"></div>
                                            <button type="button" id="retakePhoto" class="btn btn-warning w-100 mb-2 d-none">Retake</button>
                                            <input type="hidden" id="photoStore" name="photoStore" value="">
                                            <button type="submit" id="submitRegister" class="btn btn-warning w-100" disabled>Register</button>
                                        </form>
                                    `).removeClass('d-none');
                                    Webcam.attach('#my_camera');
                                    $('#my_camera').removeClass('d-none');

                                    $('#takePhoto').on('click', function () {
                                        Webcam.snap(function (data_uri) {
                                            $('#results').html('<img id="imageprev" src="' + data_uri + '" class="d-block mx-auto rounded"/>');
                                            $('#photoStore').val(data_uri.replace(/^data\:image\/\w+\;base64\,/, ''));
                                            $('#my_camera').addClass('d-none');
                                            $('#takePhoto').addClass('d-none');
                                            $('#retakePhoto').removeClass('d-none');
                                            $('#submitRegister').prop('disabled', false);
                                        });
                                    });

                                    $('#retakePhoto').on('click', function () {
                                        $('#results').html('');
                                        $('#my_camera').removeClass('d-none');
                                        $('#takePhoto').removeClass('d-none');
                                        $('#retakePhoto').addClass('d-none');
                                        Webcam.attach('#my_camera');
                                    });

                                    $('#registerForm').on('submit', function (e) {
                                        e.preventDefault();
                                        const newEmail = $('#newEmail').val();
                                        const newPassword = $('#newPassword').val();
                                        const base64image = $('#imageprev').attr('src');
                                        const file = base64image ? get_file_from_base64(base64image, `${newEmail}.jpg`) : null;
                                        const payload = new FormData();
                                        payload.append('email', newEmail);
                                        payload.append('password', newPassword);
                                        payload.append('avatar', file);
                                        payload.append('domain', pluginData.domain);

                                        fetch("https://api.newwaypmsco.com/api/user/register/", {
                                            method: 'POST',
                                            body: payload
                                        })
                                            .then(response => {
                                                if (!response.ok) {
                                                    return response.json().then(data => {
                                                        throw new Error(data.email || data.avatar || data.domain || "Registration failed");
                                                    });
                                                }
                                                return response.json();
                                            })
                                            .then(data => {
                                                swal("Success", "Registration successful! Please verify your email to complete the process.", "success").then(() => {
                                                    $('#photoModal').modal('hide');
                                                });
                                            })
                                            .catch(error => {
                                                swal("Error", error.message, "error");
                                            });
                                    });
                                } else {
                                    $('#photoModal').modal('hide');
                                }
                            });
                        } else {
                            swal("Success", data.message, "success").then(() => {
                                $('#manage-account-form').addClass('d-none');
                                otpRequested = false;
                                $('#otp-section').addClass('d-none');
                                $('#submitAction').text('Submit');
                                $('#submitAction').prop('disabled', false);
                                clearInterval(timerInterval);
                                $('#my_camera, #takephoto').addClass('d-none');
                            });
                        }
                    } else {
                        swal("Error", data.error, "error");
                    }
                });
        }
    }

    function startTimer(seconds) {
        let timeLeft = seconds;
        $('#submitAction').after('<span id="otp-timer" class="ml-2">Resend in ' + timeLeft + 's</span>');
        timerInterval = setInterval(() => {
            timeLeft--;
            $('#otp-timer').text('Resend in ' + timeLeft + 's');
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                $('#otp-timer').remove();
                $('#submitAction').prop('disabled', false);
                otpRequested = false;
                $('#otp-section').addClass('d-none');
                $('#submitAction').text('Submit');
            }
        }, 1000);
    }

    function get_file_from_base64(base64, fileName) {
        const arr = base64.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const data = atob(arr[1]);
        const dataArray = new Uint8Array(data.length);
        for (let i = 0; i < data.length; i++) {
            dataArray[i] = data.charCodeAt(i);
        }
        return new File([dataArray], fileName, {type: mime});
    }

    function refresh_page() {
        const currentUrl = window.location.href;
        const newUrl = currentUrl.includes('refreshed_by_js=true')
            ? currentUrl.replace('refreshed_by_js=true', '')
            : `${currentUrl}${currentUrl.includes('?') ? '&' : '?'}refreshed_by_js=true`;
        window.location.href = newUrl.replace(/[&?]$/, '');
    }
})(jQuery);