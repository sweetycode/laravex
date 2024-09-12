<?php

namespace Laravex\Console\Commands;

use App\Services\SitemapService;
use Illuminate\Console\Command;
use Laravex\Utils\SitemapCollector;

class GenerateSitemapCommand extends Command
{
/**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sitemap:generate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate sitemap';

    private SitemapService $sitemapService;

    function __construct(SitemapService $sitemapService) {
        parent::__construct();
        $this->sitemapService = $sitemapService;
    }

    /**
     * Execute the console command.
     */
    function handle()
    {
        $collector = new SitemapCollector();
        $this->sitemapService->collectSitemap($collector);
        $result = view('laravex::sitemap.index', ['items' => $collector->getItems()])->render();
        file_put_contents(public_path('sitemap.xml'), $result);
        $this->info('generate sitemap succeed at public/sitemap.xml');
    }
}
