@extends('laravex::layouts.html')

@push('css')
    @vite('resources/css/app.scss')
@endpush

@section('body')
    <div class="h-screen flex bg-stone-100 items-center justify-center">
        <div class="bg-white shadow p-4 rounded min-w-80">
            <h2 class="text-2xl font-simibold text-center mb-4">Login</h2>
            <form method="POST">
                @csrf
                <input name="remember" type="checkbox" checked class="hidden"/>
                <table class="w-full">
                    <tr>
                        <td><label>Email:</label></td>
                        <td><input type="email" name="email" value="{{old('email')}}" class="border border-gray-300 rounded p-1 w-full"></td>
                    </tr>
                    <tr>
                        <td><label>Password:</label></td>
                        <td><input type="password" name="password" class="border border-gray-300 rounded p-1 w-full"></td>
                    </tr>
                </table>
                @if($errors->any())
                <div class="text-red-700 py-2">
                    <span class="font-semibold">Error Happens:</span>
                    <ul class="list-disc pl-4">
                        @foreach($errors->all() as $error)
                            <li>{{$error}}</li>
                        @endforeach
                    </ul>
                </div>
                @endif
                <div class="text-right mt-2">
                    <button type="submit "class="bg-blue-400 hover:bg-blue-500 text-white rounded px-2 py-1">登录</button>
                </div>
            </form>
        </div>
    </div>
@endsection
