<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\KosController;
use App\Http\Controllers\PostController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReplyController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\KosSubmissionController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('posts', PostController::class);
Route::apiResource('kos', KosController::class)->parameters([
    'kos' => 'kos'
]);

Route::post('/kos-submissions', [KosSubmissionController::class, 'store']);
Route::get('/kos-submissions', [KosSubmissionController::class, 'index']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/posts/{post}/reply', [ReplyController::class, 'store']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/kos/{kos}/review', [ReviewController::class, 'store']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/user/update', [UserController::class, 'update']);
});
