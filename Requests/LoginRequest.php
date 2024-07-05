<?php

namespace Laravex\Requests;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest {
    public function authenticate(): void {
        $this->ensureIsNotRateLimited();

        $throttleKey = $this->throttleKey();
        if (!Auth::attempt($this->only('email', 'password'), $this->boolean('remember'))) {
            RateLimiter::hit($throttleKey);
            throw ValidationException::withMessages([
                'email' => trans('auth.failed'),
            ]);
        }
        RateLimiter::clear($throttleKey);
    }

    protected function ensureIsNotRateLimited(): void {
        $throttleKey = $this->throttleKey();
        if (!RateLimiter::tooManyAttempts($throttleKey, 5)) {
            return;
        }
        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($throttleKey);
        throw ValidationException::withMessages([
            'email' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds/60),
            ]),
        ]);
    }

    protected function throttleKey(): string {
        return Str::transliterate(Str::lower($this->string('email')).'|'.$this->ip());
    }
}
