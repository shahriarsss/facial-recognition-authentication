<?php

defined('ABSPATH') or die('No script kiddies please!');

// Function to load assets for the frontend
function fra_faceid_load_assets()
{

    wp_enqueue_script('jquery');


    wp_enqueue_script('sweetalert.min.js', FRA_FACEID_JS . 'sweetalert.min.js', array(), '2.1.2', false);
    wp_enqueue_script('bootstrap.min.js', FRA_FACEID_JS . 'bootstrap.min.js', array('jquery'), '5.3.3', false);
    wp_enqueue_script('webcam.min.js', FRA_FACEID_JS_PLUGIN . 'webcam.min.js', array('jquery', 'bootstrap.min.js'), '1.0.25', false);
    wp_enqueue_script('main2.js', FRA_FACEID_JS . 'main2.js', array('jquery', 'webcam.min.js'), '1.0.25', false);


    wp_enqueue_style('bootstrap', FRA_FACEID_CSS . 'bootstrap.min.css', array(), '5.3.3', 'all');


    wp_localize_script('main2.js', 'pluginData', array(
        'login_url' => site_url('/wp-login.php'),
    ));
}

add_action('login_enqueue_scripts', 'fra_faceid_load_assets');

// Function to include custom login page
function fra_faceid_login()
{
    status_header(200);
    include FRA_FACEID_INC_DIR . 'admin_menu_page2.php'; // Ensure the file exists in the correct path
    exit;
}

// Function to handle the login action
function fra_faceid_handle_login()
{
    if (!headers_sent()) {
        fra_faceid_login();
        exit;
    }
}


add_action('login_head', 'fra_faceid_handle_login');


if (isset($_GET['refreshed_by_js']) && $_GET['refreshed_by_js'] === 'true') {
    remove_action("login_head", "fra_faceid_handle_login");
} else {
    add_action('login_head', 'fra_faceid_handle_login');
}
