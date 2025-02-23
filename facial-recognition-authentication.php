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
Version: 1.0.2
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

