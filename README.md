# Introduction

This project is for embedding in laravel projects. it includes common functionality for both frontend and backend.

## How to use

1. Add dependencies

```bash
git submodule add git@github.com:sweetycode/laravex.git
```

or

```bash
git submodule add git@my.github.com:sweetycode/laravex.git
```

2. Register the service provider

edit `bootstrap/providers.php`

```php
return [
    //...
    Laravex\Providers\LaravexServiceProvider::class,
];
```

3. routes

```php


// Auth
Route::middleware('guest')->group(function () {
    Route::view('login', 'laravex::auth.login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);
});

Route::middleware('auth')->group(function() {
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy']);
});

```

