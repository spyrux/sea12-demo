<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\ShipmentVersion;
use App\Observers\ShipmentObserver;
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        ShipmentVersion::observe(ShipmentObserver::class);
    }
}
