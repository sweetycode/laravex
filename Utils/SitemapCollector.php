<?php

namespace Laravex\Utils;

use Illuminate\Database\Eloquent\Builder;

class SitemapCollector {
    function addQuery(Builder $query): SitemapCollector {
        return $this;
    }

    function addCollection(Builder $collection): SitemapCollector {
        return $this;
    }

    function addLinks(string ...$links): SitemapCollector {
        return $this;
    }
}
