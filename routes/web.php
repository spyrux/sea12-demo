<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ShipmentController;
use App\Http\Controllers\TransactionController; // 👈 add
use App\Http\Controllers\ContractController; 

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $shipments = \App\Models\Shipment::with(['latestVersion.vessel', 'latestVersion.origin', 'latestVersion.destination'])
            ->latest()
            ->get()
            ->map(function (\App\Models\Shipment $s) {
                return [
                    'id'   => $s->id,
                    'status' => $s->status,
                    'cargo_sailing_date' => optional($s->cargo_sailing_date)?->toDateString(),
                    'eta'   => optional($s->eta)?->toDateString(),
                    'latest' => [
                        'vessel' => $s->latestVersion?->vessel ? [
                            'name' => $s->latestVersion->vessel->name
                        ] : null,
                        'origin' => $s->latestVersion?->origin ? [
                            'name' => $s->latestVersion->origin->name
                        ] : null,
                        'destination' => $s->latestVersion?->destination ? [
                            'name' => $s->latestVersion->destination->name
                        ] : null,
                    ],
                ];
            });

        return Inertia::render('dashboard', [
            'shipments' => [
                'data' => $shipments,
                'total' => $shipments->count(),
                'current_page' => 1,
                'last_page' => 1,
                'per_page' => $shipments->count(),
            ],
        ]);
    })->name('dashboard');
    Route::resource('shipments', ShipmentController::class);
    Route::resource('shipments.transactions', TransactionController::class)
    ->only(['store']) 
    ->shallow();   
    Route::resource('contracts', ContractController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
