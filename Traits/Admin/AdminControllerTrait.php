<?php

namespace Laravex\Traits\Admin;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;

trait AdminControllerTrait {
    private static $ACTIONS = [
        'list',
        'get',
        'store',
        'update',
    ];
    static function registerRoutes(string $prefix='api') {
        $prefix = trim($prefix, '/') . '/';
        $resources = static::getResources();
        foreach(array_keys($resources) as $name) {
            Route::get($prefix.$name, ['App\Http\Controllers\AdminController', 'list'.Str::ucfirst(Str::camel($name))]);
            Route::get($prefix.$name.'/{id}', ['App\Http\Controllers\AdminController', 'get'.Str::ucfirst(Str::camel(Str::singular($name)))]);
            Route::put($prefix.$name.'/{id}', ['App\Http\Controllers\AdminController', 'update'.Str::ucfirst(Str::camel(Str::singular($name)))]);
            Route::post($prefix.$name, ['App\Http\Controllers\AdminController', 'store'.Str::ucfirst(Str::camel(Str::singular($name)))]);
        }
    }

    function __call($method, $args) {
        [$action, $name] = static::parseResourceOperation($method);
        $resource = static::getResources()[$name];
        $modelClass = 'App\\Models\\' . Str::ucfirst(Str::camel(Str::singular($name)));

        switch($action) {
            case 'list':
                return $this->_listResource($resource, $modelClass);
            case 'get':
                return $this->_getResource($resource, $modelClass, $args);
            case 'update':
                return $this->_updateResource($resource, $modelClass, $args);
            case 'store':
                return $this->_storeResource($resource, $modelClass);
        }
    }

    private function _listResource($resource, $modelClass) {
        $result = call_user_func([$modelClass, 'with'], $resource['with'] ?? [])
            ->orderBy('id', 'desc')
            ->paginate($resource['perPage'] ?? 15);
        return response()->json($result);
    }

    private function _getResource($resource, $modelClass, $args) {
        $id = $args[0];
        $result = call_user_func([$modelClass, 'with'], $resource['with'] ?? [])->findOrFail($id);
        return response()->json($result);
    }

    private function _updateResource($resource, $modelClass, $args) {
        $id = $args[0];
        $input = request()->all();
        $relations = static::stripRelations($resource, $input);
        $result = call_user_func([$modelClass, 'where'], ['id' => $id])->update($input);
        static::applyRelations($modelClass, $id, $relations);
        return response()->json(compact('id'));
    }

    private function _storeResource($resource, $modelClass) {
        $input = request()->all();
        $relations = static::stripRelations($resource, $input);
        $result = call_user_func([$modelClass, 'create'], $input);
        static::applyRelations($modelClass, $result['id'], $relations);
        return response()->json($result);
    }

    /**
     * @param array $resource: ['belongsToMany' => ['tags']]
     * @param array $input [..., tags_name, ...]
     * @return array [tags => ...]
     */
    private static function stripRelations(array $resource, array &$input): array {
        $result = [];
        foreach ($resource['belongsToMany'] ?? [] as $name) {
            $values = $input[$name . '_name'] ?? null;
            unset($input[$name . '_name']);
            if ($values) {
                $result[$name] = $values;
            }
        }
        return $result;
    }

    private static function applyRelations(string $modelClass, int $id, array $relations) {
        foreach (array_keys($relations) as $name) {
            $ids = collect($relations[$name])->map(function ($item) use ($name) {
                $relationModelClass = 'App\\Models\\'. Str::ucfirst(Str::camel(Str::singular($name)));
                $record = call_user_func([$relationModelClass, 'where'], ['name' => $item])->first();
                if (!$record) {
                    $record = call_user_func([$relationModelClass, 'create'], ['name' => $item]);
                }
                return $record;
            })->pluck('id');
            call_user_func([$modelClass, 'findOrFail'], $id)->$name()->sync($ids);
        }
    }

    static function getResources() {
        return [
        ];
    }

    static function parseResourceOperation($methodName) {
        $resources = static::getResources();

        foreach (static::$ACTIONS as $action) {
            if (str_starts_with($methodName, $action)) {
                $name = Str::plural(strtolower(substr($methodName, strlen($action))));
                if (array_key_exists($name, $resources) && $action) {
                    return [$action, $name];
                }
            }
        }
        throw new \BadMethodCallException("Can't parse the method name of " . $methodName);
    }
}
