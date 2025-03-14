<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::post('/login', [AuthenticatedSessionController::class, 'store']);

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth:sanctum');

Route::get('/shops', [\App\Http\Controllers\ShopController::class, 'index'])->middleware('auth:sanctum');

Route::post('item/{id}', [\App\Http\Controllers\ShoppingListItemController::class, 'store'])->middleware('auth:sanctum');

Route::patch('item/{item}', [\App\Http\Controllers\ShoppingListItemController::class, 'update'])->middleware('auth:sanctum');

Route::delete('item/{item}', [\App\Http\Controllers\ShoppingListItemController::class, 'destroy'])->middleware('auth:sanctum');

Route::get('/search', [\App\Http\Controllers\ShoppingListItemController::class, 'search'])->middleware('auth:sanctum');

Route::get('list/{id}', [\App\Http\Controllers\ShoppingListController::class, 'show'])->middleware('auth:sanctum');

Route::post('{shop_id}', [\App\Http\Controllers\ShoppingListController::class, 'store'])->middleware('auth:sanctum');

Route::get('{shop_id}', [\App\Http\Controllers\ShoppingListController::class, 'index'])->middleware('auth:sanctum');

Route::delete('list/{id}', [\App\Http\Controllers\ShoppingListController::class, 'destroy'])->middleware('auth:sanctum');

Route::get('sort/{list_id}', [\App\Http\Controllers\ShoppingListController::class, 'sortList'])->middleware('auth:sanctum');




