<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shipment_versions', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->foreignUlid('shipment_id')
                  ->constrained('shipments')
                  ->cascadeOnDelete();
            $table->unsignedInteger('version');   
            $table->string('status')->index();
            $table->date('cargo_sailing_date')->nullable();
            $table->date('eta')->nullable();

            $table->foreignUlid('vessel_id')->nullable()
                  ->constrained('vessels')->nullOnDelete();

            $table->foreignUlid('origin_id')->nullable()
                  ->constrained('locations')->nullOnDelete();

            $table->foreignUlid('destination_id')->nullable()
                  ->constrained('locations')->nullOnDelete();

            $table->foreignUlid('actor_id')->nullable()
                  ->constrained('users')->nullOnDelete();

            $table->timestamps();

            $table->unique(['shipment_id', 'version']);
            $table->index(['shipment_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shipment_versions');
    }
};
