<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Exception;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\QueryException;
use Laravel\Socialite\Two\InvalidStateException;

class GoogleLoginController extends Controller
{
    public function redirectToGoogle(): RedirectResponse
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Collect the user information from Google.
     * @return RedirectResponse
     */
    public function handleGoogleCallback(): RedirectResponse
    {
        $googleUser = null;
        try {
            $googleUser = Socialite::driver('google')->user();

            if (!$googleUser) {
                Log::error('Google Socialite user not found or token invalid.');
                return redirect('/login')->with('error', 'Could not retrieve user information from Google.');
            }

            $existingUserByEmail = User::where('email', $googleUser->getEmail())->first();

            if ($existingUserByEmail) {
                $userAttributes = $existingUserByEmail->toArray();
                $allKeys = array_keys($userAttributes);

                #dd($allKeys);

                Log::debug('Keys for existingUserByEmail:', ['keys' => $allKeys]);

                if (empty($existingUserByEmail->google_id)) {
                    $existingUserByEmail->google_id = $googleUser->getId();
                    $existingUserByEmail->google_token = $googleUser->token;
                    $existingUserByEmail->google_refresh_token = $googleUser->refreshToken;
                    $existingUserByEmail->save();

                    Auth::login($existingUserByEmail, true);
                    Log::info('Existing user by email linked with Google ID and logged in.', ['user_id' =>
                        $existingUserByEmail->id, 'email' => $existingUserByEmail->email]);
                    return redirect()->intended('/dashboard');

                } elseif ($existingUserByEmail->google_id === $googleUser->getId()) {
                    $existingUserByEmail->name = $googleUser->getName();
                    $existingUserByEmail->google_token = $googleUser->token;
                    $existingUserByEmail->google_refresh_token = $googleUser->refreshToken;
                    $existingUserByEmail->save();

                    Auth::login($existingUserByEmail, true);
                    Log::info('Existing user by email and matching Google ID logged in.', ['user_id' =>
                        $existingUserByEmail->id, 'email' => $existingUserByEmail->email]);
                    return redirect()->intended('/dashboard');

                } else {
                    Log::warning('Google login email conflict: existing user email is linked to a different Google ID.', [
                        'attempted_google_email' => $googleUser->getEmail(),
                        'existing_user_id' => $existingUserByEmail->id,
                        'existing_google_id' => $existingUserByEmail->google_id,
                        'new_google_id' => $googleUser->getId(),
                    ]);
                    return redirect('/login')->with('error', 'This email address is already associated with a different Google account.
                    Please log in with the correct Google account or use your password if you have one.');
                }
            } else {
                $user = User::updateOrCreate(
                    [
                        'google_id' => $googleUser->getId(),
                    ],
                    [
                        'name' => $googleUser->getName(),
                        'email' => $googleUser->getEmail(),
                        'google_token' => $googleUser->token,
                        'password' => $this->generateUserPassword($googleUser->getEmail()),
                    ]
                );

                Auth::login($user, true);
                Log::info('User found/created by google_id and logged in.',
                    ['user_id' => $user->id, 'email' => $user->email, 'was_recently_created' => $user->wasRecentlyCreated]);


                if (!Auth::check()) { // Should not happen if Auth::login was successful
                    Log::error('User was not logged in successfully after Google callback (post-email check).', ['user_id' => $user->id]);
                    return redirect('/login')->with('error', 'Login failed after Google authentication.');
                }
                return redirect()->intended('/home');
            }

        } catch (QueryException $e) {
            Log::error('Database error during Google callback: ' . $e->getMessage(), [
                'sql_error_code' => $e->getCode(),
                'error_info' => $e->errorInfo,
                'google_user_email' => $googleUser ? $googleUser->getEmail() : 'N/A',
            ]);

            $driverErrorCode = $e->errorInfo[1] ?? null;
            $driverErrorMessage = strtolower($e->errorInfo[2] ?? '');

            if ($driverErrorCode == 1062 || $driverErrorCode == 23505 || ($driverErrorCode == 19 && str_contains($driverErrorMessage, 'unique constraint failed'))) {
                return redirect('/login')->with('error', 'An account with this email already exists. If this is your account,
                please try logging in with your password or ensure you are using the correct Google account.');
            }

            return redirect('/login')->with('error', 'A database error occurred while processing your login. Please try again.');

        } catch (InvalidStateException $e) {
            Log::error('Google Socialite InvalidStateException: ' . $e->getMessage());
            return redirect('/login')->with('error', 'Login session expired or was invalid. Please try again.');
        } catch (ClientException $e) {
            Log::error('Google Socialite Guzzle ClientException: ' . $e->getMessage());
            return redirect('/login')->with('error', 'Could not connect to Google. Please check configuration or try again.');
        } catch (Exception $e) {
            Log::error('General error in Google callback: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'google_user_email' => $googleUser ? $googleUser->getEmail() : 'N/A',
            ]);
            return redirect('/login')->with('error', 'An unexpected error occurred. Please try again.');
        }
    }

    /**
     * Generates or retrieves a password for a social user.
     * Since they don't use a traditional password with your app,
     * you still need to satisfy the 'password' field if it's not nullable.
     */
    protected function generateUserPassword(string $email): string
    {
        $existingUser = User::where('email', $email)->first();
        if ($existingUser && $existingUser->password) {
            return $existingUser->password;
        }
        return Hash::make(Str::random(24));
    }
}
