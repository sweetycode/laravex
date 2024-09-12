<?php

namespace Laravex\Utils;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class SitemapCollector {
    private Collection $items;

    function __construct() {
        $this->items = collect();
    }

    function addQuery(Builder $query): SitemapCollector {
        return $this->addCollection($query->get());
    }

    function addCollection(Collection $collection): SitemapCollector {
        $this->items = $this->items->concat($collection);
        return $this;
    }

    function addLinks(string ...$links): SitemapCollector {
        return $this;
    }

    function getItems(): Collection {
        return $this->items;
    }
}
