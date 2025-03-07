=== Facial Recognition Authentication ===
Contributors: NewWayPMSCo
Tags: facial recognition, two-factor authentication, login security, WordPress security
Requires at least: 5.0
Tested up to: 6.7
Requires PHP: 7.4
Stable tag: 1.1.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Facial Recognition Authentication plugin integrates facial recognition with WordPress login for enhanced security and user experience.

== Description ==

For years, users worldwide have faced security risks due to insecure login pages. WordPress sites are no exception to these challenges. Our plugin provides an innovative solution for login security by integrating facial recognition technology with traditional username and password methods.

Currently, users log in using either a username and password or a Two-Factor Authentication (2FA) method. While 2FA enhances security, it has its own vulnerabilities:

1. **Phishing attacks**: Hackers can deceive users into entering their 2FA codes on fake websites.
2. **Lost or stolen devices**: If the device used to receive 2FA codes (e.g., a mobile phone) is lost or stolen, unauthorized access becomes possible.
3. **SMS-based 2FA**: SMS codes can be intercepted through SIM swapping attacks.
4. **Access issues**: Users may face challenges accessing 2FA codes due to technical issues.
5. **Software flaws**: Authentication apps can have security vulnerabilities.

Our plugin addresses these issues by leveraging facial recognition for authentication. When a user attempts to log in, our plugin communicates with a secure Django server for authentication, ensuring no sensitive user data is stored in WordPress databases. The facial recognition system can distinguish between a live user and a static photo, making unauthorized access virtually impossible.

**Key Features:**

- Facial recognition authentication using a simple webcam.
- No storage of user credentials in WordPress databases.
- Interaction between the plugin and server is conducted through secure APIs with encrypted data transmission.
- Enhanced security with PBKDF2 password hashing (870,000 iterations with salt) on the Django server.
- Seamless integration with WordPress login pages, adding an extra layer of security.
- Simplified registration process for users to set up facial recognition and credentials.
- New **Manage Account** section for users to change their password, update photo, or delete their account, secured with OTP and facial recognition.
- Activation email sent during registration, with a 24-hour expiration period.
- Each user can only register with a single email address.

**Why Choose Our Plugin?**

1. Protects against brute-force attacks targeting WordPress login pages.
2. Eliminates reliance on weak password hashing mechanisms in WordPress.
3. Enhances user experience by enabling secure logins without expensive hardware.
4. Provides a scalable solution for future platforms beyond WordPress.

**Try Our Demo Before Installing!**

Want to test our plugin in a safe environment before installing it on your own site? We’ve set up a demo WordPress site where you can experience the plugin in action.

**Email us at [support@newwaypmsco.com]** to request access – we’ll send you the demo site link, along with a username and password to log in and test the plugin.

Once you're satisfied, you can install it on your own WordPress site with confidence!

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress.
3. Register your username, password, and facial data using a webcam during the first-time setup. Make sure to capture a clear photo of your face and use the username and password you choose during registration.
4. After completing the registration, log out from the WordPress dashboard. The plugin will then prompt you to authenticate using facial recognition on the login page. Ensure your webcam is enabled.

== Frequently Asked Questions ==

= How can I test the plugin before installing it on my site? =
We offer a demo site where you can test the plugin before installing it on your WordPress site. Email us at **[support@newwaypmsco.com]** to request access – we’ll send you the demo site link, along with a username and password to log in and test the plugin.

= What happens if the facial recognition fails? =
In the rare event that facial recognition fails, users can retry or contact support for assistance.

= What should I do if I get a "Domain mismatch" error? =
This error occurs if you try to log in from a different domain than where you registered. Ensure you’re logging in from the same site where you set up your account (e.g., https://yourdomain.com). Contact support if the issue persists.

= Is my facial data secure? =
Yes, facial data is securely processed and stored on the Django server using industry-standard encryption. No sensitive data is stored in the WordPress database.

= Do I need special hardware for facial recognition? =
No, our plugin works with any standard webcam.

== Screenshots ==

1. **Login Page:** Enhanced login page with facial recognition.
2. **Registration Page:** Simple registration process with webcam integration.
3. **Security Settings:** Plugin settings page for administrators.

== Changelog ==

= 1.1.0 - 2025-03-07 =
* Added "Manage Account" section for users to change password, delete account, and update photo.
* Implemented OTP verification with facial recognition for secure account changes.
* New account activation email sent during registration, with 24-hour expiration.
* Users can only register with a single email address.

= 1.0.4 - 2025-02-24 =
* Improved photo quality for better facial recognition accuracy.
* Minor bug fixes and performance improvements.

= 1.0.3 - 2025-02-23 =
* Fixed login issue where FormData was not sending correctly, ensuring proper authentication with domain validation.
* Improved logging in Django backend for better debugging.

= 1.0.2 =
* Disabled admin notices on plugin page to improve user experience.
* Fixed minor bugs and improved performance.

= 1.0.1 =
* Fixed style issues in frontend and backend views.
* Improved security integration for webcam-based authentication.
* Minor bug fixes and code improvements.

= 1.0.0 =
* Initial release with facial recognition and secure authentication features.

== Upgrade Notice ==

= 1.1.0 =
This update adds the "Manage Account" feature, enabling users to change passwords, delete accounts, and update photos with OTP and facial recognition for extra security. Update is highly recommended.

= 1.0.4 =
This update ensures better photo quality for accurate facial recognition. Update for improved security.

= 1.0.3 =
This update fixes a login issue with FormData and improves backend logging for easier debugging. Update recommended for all users.

= 1.0.1 =
This update addresses UI style issues in both the front-end and back-end views. It also improves the security integration for the webcam-based authentication.

== External Services ==

This plugin connects to an external Django server to perform facial recognition authentication. The communication between the plugin and the server is secure, ensuring the safety of user data through encrypted transmission.

### **Third-Party Service Details**

1. **Service Name:** Django Server for Facial Recognition Authentication
   - **Purpose:** To authenticate users using facial recognition.
   - **Data Sent:**
     - During login:
       - Username and password entered by the user.
       - Facial image captured by the webcam for authentication.
     - During registration:
       - Username and password chosen by the user.
       - Facial image captured by the webcam to set up facial recognition.
   - **Storage & Security:**
     - All data is transmitted securely using SSL encryption.
     - Facial data is stored on our Django server with AES-256 encryption.
     - No facial data is stored in WordPress databases.
   - **Conditions:** Data is sent only when users initiate login or registration.
   - **User Control:** We’re working on adding a feature to let users delete their facial data in future updates. For now, contact our support team at **[support@newwaypmsco.com]** for assistance with data management.
   - **Terms of Service:** [https://api.newwaypmsco.com/terms-of-service/](https://api.newwaypmsco.com/terms-of-service/)
   - **Privacy Policy:** [https://api.newwaypmsco.com/privacy-policy/](https://api.newwaypmsco.com/privacy-policy/)

2. **External API Endpoints Used:**
   - `https://api.newwaypmsco.com/api/user/login/`
   - `https://api.newwaypmsco.com/api/user/register/`

By using this plugin, users acknowledge and agree to the terms and conditions outlined above.

== Resources ==
This plugin uses the open-source SweetAlert library for user alerts. Non-minified source code is available in:
- assets/js/bootstrap.js (non-minified version)
- assets/js/sweetalert.min.js (SweetAlert library)

- Official SweetAlert Website: https://sweetalert.js.org/
- SweetAlert CDN: https://cdnjs.com/libraries/sweetalert/2.1.2
- GitHub Repository: https://github.com/t4t5/sweetalert
