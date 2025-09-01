<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('shipments', function (Blueprint $t) {
            $t->ulid('id')->primary();
            $t->ulid('latest_version_id')->nullable()->index();
            $t->timestamps();
        
            $t->foreign('latest_version_id')->references('id')->on('shipment_versions');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipments');
    }
};
