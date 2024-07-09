<!DOCTYPE html>
<html lang="zh-CN">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>{{$pageTitle ?? ''}}</title>
    @stack('meta')
    @stack('css')
    @stack('headjs')
</head>
<body>

@section('body')
@show

@stack('js')
</body>

</html>
