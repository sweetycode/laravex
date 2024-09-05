<?php

namespace Laravex\Foundation;

use Illuminate\Filesystem\Filesystem;
use Illuminate\View\FileViewFinder;


/**
 * Should only be enabled in local development env
 */
class AstroViewFinder extends FileViewFinder {

    private $astroViewCache = [];

    function __construct(Filesystem $files, array $paths, array|null $extensions = null) {
        parent::__construct($files, $paths, $extensions);
    }

    function find($name) {
        $this->resolveAstroView($name);
        return parent::find($name);
    }

    protected function resolveAstroView($name) {
        if (!str_starts_with($name, 'astro::')) {
            return;
        }

        $view = str_replace('.', '/', substr($name, 7));
        $url = 'http://127.0.0.1:7788/' . $view;
        $filepath = base_path('astroview/blade/' . $view . '.blade.php');
        $response = file_get_contents($url);
        $response = str_replace('@vite', '@@vite', $response);
        $response = str_replace('<script type="module" src="/', '<script type="module" src="http://127.0.0.1:7788/', $response);
        if ($this->astroViewCache[$name] ?? '' != $response) {
            file_put_contents($filepath, $response);
            $this->astroViewCache[$name] = $response;
        }
    }
}
