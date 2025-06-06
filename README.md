# Example App

## Description
Simple Laravel env test. 

## Installation

To install `example-app`, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd example-app
   ```

2. **Install PHP dependencies:**
   ```bash
   composer install
   ```

3. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

4. **Copy the environment file:**
   ```bash
   cp .env.example .env
   ```

5. **Generate an application key:**
   ```bash
   php artisan key:generate
   ```

6. **Configure your database:**
   Update the `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, and `DB_PASSWORD` variables in your `.env` file.

7. **Run database migrations:**
   ```bash
   php artisan migrate
   ```

8. **Build assets:**
   ```bash
   npm run build
   ```

9. **Start the development server:**
   ```bash
   php artisan serve
   ```

## Dependencies

*   PHP >= 8.0
*   Laravel >= 9.0
*   Composer
*   Node.js & npm

## Google OAuth Integration

This project includes Google OAuth integration for user authentication. To configure it, you will need to:

1.  **Create a Google Cloud Project:** Go to the Google Cloud Console and create a new project.
2.  **Enable the Google+ API:** In the API Library, search for and enable the Google+ API (or the appropriate successor API for sign-in).
3.  **Create OAuth 2.0 Client IDs:** In the "Credentials" section, create an OAuth 2.0 Client ID. Choose "Web application" as the application type.
4.  **Configure Authorized Redirect URIs:** Add the redirect URI for your application. This will typically be something like `http://localhost:8000/auth/google/callback` during development.
5.  **Update your `.env` file:** Add the following variables to your `.env` file with your Google Client ID and Client Secret:
    ```env
    GOOGLE_CLIENT_ID=<your_google_client_id>
    GOOGLE_CLIENT_SECRET=<your_google_client_secret>
    GOOGLE_REDIRECT_URI=<your_google_redirect_uri>
    ```
6.  **Configure the Google Socialite Provider:** Ensure that the `config/services.php` file has the necessary configuration for the Google provider using Laravel Socialite.

Once configured, you should be able to use the Google sign-in functionality within the application.
