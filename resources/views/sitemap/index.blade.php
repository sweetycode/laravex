<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:noNamespaceSchemaLocation="https://example.com/schema.xsd">
    @foreach ($items as $item)
    <url>
        <loc>{{$item->url}}</loc>
        <changefreq>{{$item->freq ?? 'weekly'}}</changefreq>
        <priority>{{$item->prior ?? 0.8}}</priority>
    </url>
    @endforeach
</urlset>
