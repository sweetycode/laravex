<?php

namespace Laravex\Providers;

use Illuminate\Support\Facades\App;
use Illuminate\Support\ServiceProvider;
use Laravex\Console\Commands\AddUserCommand;
use Laravex\Console\Commands\GenerateSitemapCommand;
use Laravex\Foundation\AstroViewFinder;

class LaravexServiceProvider extends ServiceProvider {
    /**
     * Register any application services.
     */
    public function register(): void
    {
        if (App::environment() == 'local') {
            $this->app->singleton('view.finder', function ($app) {
                return new AstroViewFinder($app['files'], $app['config']['view.paths']);
            });
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->loadViewsFrom(base_path('astroview/blade'), 'astro');

        // Remove following view dir
        $this->loadViewsFrom(__DIR__ . '/../resources/views', 'laravex');
        if ($this->app->runningInConsole()) {
            $this->commands(AddUserCommand::class);
            $this->commands(GenerateSitemapCommand::class);
        }
    }
}
