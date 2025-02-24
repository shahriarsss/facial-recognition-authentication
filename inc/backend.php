<?php
if (!defined('ABSPATH')) exit;

function fra_faceid_admin_menu() {
    include FRA_FACEID_INC_DIR . 'admin_menu_page.php';
}

function fra_faceid_load_assets() {
    if (!wp_script_is('jquery', 'enqueued')) {
        wp_enqueue_script('jquery');
    }

    wp_enqueue_script('sweetalert.min.js', FRA_FACEID_JS . 'sweetalert.min.js', array(), '2.1.2', true);
    wp_enqueue_script('bootstrap.min.js', FRA_FACEID_JS . 'bootstrap.min.js', array('jquery'), '5.3.3', true);
    wp_enqueue_script('webcam.min.js', FRA_FACEID_JS_PLUGIN . 'webcam.min.js', array('jquery', 'bootstrap.min.js'), '1.0.25', true);
    wp_enqueue_script('main.js', FRA_FACEID_JS . 'main.js', array('jquery', 'webcam.min.js'), '1.0.25', true);

    wp_enqueue_style('fra-bootstrap', FRA_FACEID_CSS . 'bootstrap.min.css', array(), '5.3.3', 'all');
    if (!wp_style_is('fra-bootstrap', 'enqueued')) {
        wp_enqueue_style('fra-bootstrap', FRA_FACEID_CSS . 'bootstrap.min.css', array(), '5.3.3', 'all');
    }

    $domain = get_site_url();  // دامنه فعلی رو می‌فرستیم
    wp_localize_script('main.js', 'pluginData', array(
        'domain' => $domain  // تغییر از site_id به domain
    ));
}

function fra_faceid_register_my_custom_menu_page() {
    add_menu_page(
        __('Facial Recognition', 'facial-recognition-authentication'),
        'Facial Recognition',
        'manage_options',
        'face-capture-register',
        'fra_faceid_admin_menu',
        'dashicons-camera-alt',
        6
    );
    fra_faceid_load_assets();
}

add_action('admin_menu', 'fra_faceid_register_my_custom_menu_page');

function disable_admin_notices_on_plugin_page() {
    if (isset($_GET['page']) && $_GET['page'] === 'face-capture-register') {
        remove_all_actions('admin_notices');
    }
}

add_action('admin_init', 'disable_admin_notices_on_plugin_page');