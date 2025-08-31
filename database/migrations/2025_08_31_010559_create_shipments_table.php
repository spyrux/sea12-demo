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
            $t->ulid('vessel_id')->nullable()->index();
            $t->ulid('origin_id')->nullable()->index();
            $t->ulid('destination_id')->nullable()->index();
            $t->date('cargo_sailing_date');
            $t->date('eta');
            $t->string('status')->default('PLANNED')->index();
            $t->timestamps();
        
            $t->foreign('vessel_id')->references('id')->on('vessels');
            $t->foreign('origin_id')->references('id')->on('locations');
            $t->foreign('destination_id')->references('id')->on('locations');
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
