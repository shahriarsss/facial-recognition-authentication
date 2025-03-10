<?php
defined('ABSPATH') or die('No script kiddies please!');

function fra_faceid_load_assets() {
    wp_enqueue_script('jquery');
    wp_enqueue_script('sweetalert.min.js', FRA_FACEID_JS . 'sweetalert.min.js', array(), '2.1.2', false);
    wp_enqueue_script('bootstrap.min.js', FRA_FACEID_JS . 'bootstrap.min.js', array('jquery'), '5.3.3', false);
    wp_enqueue_script('webcam.min.js', FRA_FACEID_JS_PLUGIN . 'webcam.min.js', array('jquery', 'bootstrap.min.js'), '1.0.25', false);
    wp_enqueue_script('main2.js', FRA_FACEID_JS . 'main2.js', array('jquery', 'webcam.min.js'), '1.0.25', false);

    wp_enqueue_style('fra-bootstrap', FRA_FACEID_CSS . 'bootstrap.min.css', array(), '5.3.3', 'all');
    if (!wp_style_is('fra-bootstrap', 'enqueued')) {
        wp_enqueue_style('fra-bootstrap', FRA_FACEID_CSS . 'bootstrap.min.css', array(), '5.3.3', 'all');
    }

    $domain = get_site_url();
    wp_localize_script('main2.js', 'pluginData', array(
        'login_url' => site_url('/wp-login.php'),
        'domain' => $domain,
        'is_wordfence_2fa_active' => class_exists('wfUtils') && wfConfig::get('is2faEnabled') ? 'true' : 'false' // چک کردن 2FA
    ));
}

// اولویت بالا برای لود قبل از Wordfence
add_action('login_enqueue_scripts', 'fra_faceid_load_assets', 5); // اولویت 5 که زودتر از بقیه باشه

function fra_faceid_login() {
    status_header(200);
    include FRA_FACEID_INC_DIR . 'admin_menu_page2.php';
    exit;
}

function fra_faceid_handle_login() {
    if (!headers_sent()) {
        // غیرفعال کردن فرم ورود پیش‌فرض وردپرس
        remove_all_actions('login_form'); // حذف فرم‌های دیگه مثل Wordfence
        fra_faceid_login();
        exit;
    }
}

// همیشه اجرا شه مگه اینکه رفرش شده باشه
if (isset($_GET['refreshed_by_js']) && $_GET['refreshed_by_js'] === 'true') {
    remove_action('login_head', 'fra_faceid_handle_login');
} else {
    add_action('login_head', 'fra_faceid_handle_login', 1); // اولویت 1 برای اجرا قبل از Wordfence
}