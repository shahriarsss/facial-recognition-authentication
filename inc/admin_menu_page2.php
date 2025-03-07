<?php
if (!defined('ABSPATH')) exit; // Exit if accessed directly
?>

    <div class="wrap">
        <section class="bg-dark">
            <p style="color: white; font-size: 24px;">
                Please read our
                <a href="https://api.newwaypmsco.com/privacy-policy/" target="_blank" style="text-decoration: underline;">
                    Privacy Policy
                </a>
                and
                <a href="https://api.newwaypmsco.com/terms-of-service/" target="_blank" style="text-decoration: underline;">
                    Terms of Service
                </a>.
            </p>
            <div class="container-fluid">
                <div class="row text-center align-items-center justify-content-center" style="height: 100vh;">
                    <div class="col-sm-12 col-md-6 mx-auto">
                        <h1 class="text-white mb-5">
                            FaceRecognition Authentication Plugin for WordPress Websites
                        </h1>
                        <button class="btn btn-warning text-white" id="accesscamera" data-bs-toggle="modal"
                                data-bs-target="#photoModal">
                            Capture Photo
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Modal -->
        <div class="modal fade" id="photoModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Capture Photo</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div id="my_camera" class="d-block mx-auto rounded overflow-hidden"></div>
                        <div id="camera-guide" style="text-align: center; color: #333; margin-top: 10px;"></div>
                        <div id="manage-account-form" class="d-none mt-3">
                            <form id="accountForm">
                                <input type="email" id="manageEmail" name="email" placeholder="Your Email" required class="form-control mb-2">
                                <select id="manageAction" name="action" required class="form-control mb-2">
                                    <option value="">Select Action</option>
                                    <option value="change_password">Change Password</option>
                                    <option value="delete_account">Delete Account</option>
                                    <option value="change_photo">Change Photo</option>
<!--                                    <option value="delete_photo">Delete Photo</option>-->
                                </select>
                                <input type="password" id="newPassword" name="new_password" placeholder="New Password" class="form-control mb-2 d-none">
                                <div id="otp-section" class="d-none">
                                    <input type="text" id="otpCode" name="otp_code" placeholder="Enter OTP" class="form-control mb-2">
                                </div>
                                <button type="submit" id="submitAction" class="btn btn-warning w-100">Submit</button>
                            </form>
                        </div>
                        <div id="results" class="d-none"></div>
                        <form method="post" id="photoForm" enctype="multipart/form-data">
                            <input type="hidden" id="photoStore" name="photoStore" value="">
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-warning mx-auto text-white" id="takephoto" form="photoForm">
                            Capture Photo
                        </button>
                        <button type="button" class="btn btn-warning mx-auto text-white d-none" id="retakephoto">
                            Retake
                        </button>
                        <button type="submit" class="btn btn-warning mx-auto text-white d-none" id="uploadphoto"
                                form="photoForm">
                            Upload
                        </button>
                        <input type="email" name="email" form="photoForm" id="email" class="d-none" value=""
                               placeholder="Email" required/>
                        <input type="password" name="password" form="photoForm" id="password" class="d-none" value=""
                               placeholder="Enter your password" required/>
                        <div id="alert"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

<?php wp_footer(); ?>