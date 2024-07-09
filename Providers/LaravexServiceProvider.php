<?php

namespace Laravex\Providers;

use Illuminate\Support\ServiceProvider;
use Laravex\Console\Commands\AddUserCommand;

class LaravexServiceProvider extends ServiceProvider {
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->loadViewsFrom(__DIR__ . '/../resources/views', 'laravex');
        if ($this->app->runningInConsole()) {
            $this->commands(AddUserCommand::class);
        }
    }
}
