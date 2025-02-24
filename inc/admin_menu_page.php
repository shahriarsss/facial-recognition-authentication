<?php
if (!defined('ABSPATH')) exit; // Exit if accessed directly
?>

    <div class="wrap">
        <div class="container-fluid">
            <!-- Grid Bootstrap -->
            <div class="row text-center align-items-center justify-content-center"
                 style="height: 100vh; background-color: #343a40;">
                <div class="col-sm-12 col-md-6 mx-auto">
                    <h1 class="text-white mb-5">
                        FaceRecognition Authentication Plugin for WordPress Websites
                    </h1>
                    <!-- Capture Photo -->
                    <button class="btn btn-warning text-white" id="accesscamera" data-bs-toggle="modal"
                            data-bs-target="#photoModal">
                        Capture Photo
                    </button>
                </div>
            </div>
        </div>

        <!-- Modal Capture Photo -->
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
                        <div id="results" class="d-none"></div>
                        <form method="post" id="photoForm">
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