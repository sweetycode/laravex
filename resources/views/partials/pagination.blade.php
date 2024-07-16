<nav>
    {{-- https://github.com/laravel/framework/blob/11.x/src/Illuminate/Pagination/LengthAwarePaginator.php --}}
    {{-- https://github.com/laravel/framework/blob/11.x/src/Illuminate/Pagination/resources/views/tailwind.blade.php --}}
    <div class="leading-tight flex -space-x-px justify-center">
        @if($pagination->onFirstPage())
        <span class="px-4 py-3 border border-gray-300 text-gray-400 bg-gray-50 rounded-s-lg">
            <svg class="w-3 h-3 inline" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/>
            </svg>
        </span>
        @else
        <a href="{{$pagination->previousPageUrl()}}" class="px-4 py-3 border border-gray-300 text-gray-500 hover:bg-gray-50 rounded-s-lg">
            <svg class="w-3 h-3 inline" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/>
            </svg>
        </a>
        @endif
        {{dd($pagination)}}
        <a href="#" class="px-4 py-3 border border-gray-300 text-gray-500 hover:bg-gray-50">1</a>
        <a href="#" class="px-4 py-3 border border-gray-300 text-gray-500 bg-gray-100">2</a>
        <a href="#" class="px-4 py-3 border border-gray-300 text-gray-500 hover:bg-gray-50 rounded-e-lg">
            <span class="sr-only">Next</span>
            <svg class="w-3 h-3 inline" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
            </svg>
        </a>
    </div>
</nav>
