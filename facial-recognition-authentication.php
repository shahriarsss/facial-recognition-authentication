<?php

if (!defined('ABSPATH')) exit; // Exit if accessed directly

/**
 * @package Newway
 * @version 1.0.0
 */
/*
Plugin Name: Facial Recognition Authentication
Plugin URI: https://newwaypmsco.com/
License: GPL-2.0-or-later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Description: Face ID registration and login for WordPress
Author: New-way
Version: 1.1.1
*/

define('FRA_FACEID_DIR', plugin_dir_path(__FILE__));
define('FRA_FACEID_URL', plugin_dir_url(__FILE__));
define('FRA_FACEID_INC_DIR', trailingslashit(FRA_FACEID_DIR . 'inc'));
define('FRA_FACEID_ASSETS', trailingslashit(FRA_FACEID_URL . 'assets'));
define('FRA_FACEID_TPL', trailingslashit(FRA_FACEID_DIR . 'template'));
define('FRA_FACEID_CSS', trailingslashit(FRA_FACEID_ASSETS . 'css'));
define('FRA_FACEID_IMAGES', trailingslashit(FRA_FACEID_ASSETS . 'images'));
define('FRA_FACEID_JS', trailingslashit(FRA_FACEID_ASSETS . 'js'));
define('FRA_FACEID_JS_PLUGIN', trailingslashit(FRA_FACEID_JS . 'webcamjs'));

// Updated code
function fra_faceid_activation()
{
    // Code for activation without error_log
}

function fra_faceid_deactivation()
{
    // Code for deactivation without error_log
}

register_activation_hook(__FILE__, 'fra_faceid_activation');
register_deactivation_hook(__FILE__, 'fra_faceid_deactivation');

if (is_admin()) {
    if (file_exists(FRA_FACEID_INC_DIR . 'backend.php')) {
        include FRA_FACEID_INC_DIR . 'backend.php';
    }
} else {
    if (file_exists(FRA_FACEID_INC_DIR . 'frontend.php')) {
        include FRA_FACEID_INC_DIR . 'frontend.php';
    }
}

function facial_recognition_enqueue_scripts() {
    wp_enqueue_script('webcamjs', plugins_url('/assets/js/webcam.min.js', __FILE__), array(), '1.0', true);
    wp_enqueue_script('main-js', plugins_url('/assets/js/main.js', __FILE__), array('jquery', 'webcamjs'), '1.0.4', true);
    wp_enqueue_script('main2-js', plugins_url('/assets/js/main2.js', __FILE__), array('jquery', 'webcamjs'), '1.0.4', true);
    wp_localize_script('main-js', 'pluginData', array('domain' => get_site_url()));
    wp_localize_script('main2-js', 'pluginData', array('domain' => get_site_url()));
}
add_action('wp_enqueue_scripts', 'facial_recognition_enqueue_scripts');