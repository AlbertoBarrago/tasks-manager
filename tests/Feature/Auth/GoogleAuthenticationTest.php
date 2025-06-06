<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Exception;


use Illuminate\Database\QueryException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\InvalidStateException;
use GuzzleHttp\Exception\ClientException;


class GoogleLoginController extends Controller
{
    /**
     * Redirect the user to the Google authentication page.
     */
    public function redirectToGoogle(): RedirectResponse
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Collect the user information from Google.
     */
    public function handleGoogleCallback(): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->user();

            if (!$googleUser) {
                Log::error('Google Socialite: User not found or token invalid.');
                return redirect('/login')->with('error', 'Could not retrieve user information from Google.');
            }

            $user = User::where('google_id', $googleUser->getId())->first();

            if ($user) {
                $user->name = $googleUser->getName();
                $user->google_token = $googleUser->token;
                $user->google_refresh_token = $googleUser->refreshToken;
                $user->save();
            } else {
                $user = User::where('email', $googleUser->getEmail())->first();

                if ($user) {
                    $user->google_id = $googleUser->getId();
                    $user->name = $googleUser->getName();
                    $user->google_token = $googleUser->token;
                    $user->google_refresh_token = $googleUser->refreshToken;
                    $user->save();
                } else {
                    $user = User::create([
                        'name' => $googleUser->getName(),
                        'email' => $googleUser->getEmail(),
                        'google_id' => $googleUser->getId(),
                        'google_token' => $googleUser->token,
                        'google_refresh_token' => $googleUser->refreshToken,
                        'password' => $this->generateUserPassword(),
                        'email_verified_at' => now(),
                    ]);
                }
            }

            Auth::login($user, true);

            Log::info('User logged in/created via Google.', ['user_id' => $user->id, 'email' => $user->email]);

            return redirect()->intended('/dashboard');

        } catch (InvalidStateException $e) {
            Log::error('Google Socialite: InvalidStateException - ' . $e->getMessage());
            return redirect('/login')->with('error', 'Login session expired or was invalid. Please try again.');
        } catch (ClientException $e) {
            Log::error('Google Socialite: ClientException - ' . $e->getMessage());
            return redirect('/login')->with('error', 'Could not connect to Google. Please check configuration or try again.');
        } catch (QueryException $e) {
            Log::error('Google Socialite: Database QueryException - ' . $e->getMessage(), ['error_info' => $e->errorInfo]);
            if (isset($e->errorInfo[1]) && ($e->errorInfo[1] == 1062 || $e->errorInfo[0] == '23000')) {
                return redirect('/login')->with('error', 'An account with this email address already exists. Please log in using your password or the original sign-in method.');
            }
            return redirect('/login')->with('error', 'A database error occurred. Please try again.');
        } catch (Exception $e) {
            Log::error('Google Socialite: General Exception - ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return redirect('/login')->with('error', 'An unexpected error occurred. Please try again.');
        }
    }

    /**
     * Generates a password for a social user.
     * Since they don't use a traditional password with your app,
     * you still need to satisfy the 'password' field if it's not nullable.
     */
    protected function generateUserPassword(): string
    {
        return Hash::make(Str::random(24));
    }
}
