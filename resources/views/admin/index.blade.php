@extends('laravex::layouts.html')

@php
    $pageTitle = 'Admin'
@endphp

@push('meta')
<meta name="csrf-token" content="{{ csrf_token() }}">
@endpush

@push('css')
    @vite('resources/css/app.scss')
@endpush

@push('js')
    @vite('resources/js/admin.tsx')
@endpush

@section('body')
    <div id="app"></div>
@endsection
