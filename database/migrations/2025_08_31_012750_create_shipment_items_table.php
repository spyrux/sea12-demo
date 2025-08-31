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
        Schema::create('shipment_items', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('shipment_id')->index();
            $table->ulid('product_id')->index();
            $table->decimal('quantity', 10, 2);
            $table->timestamps();

            $table->foreign('shipment_id')->references('id')->on('shipments');
            $table->foreign('product_id')->references('id')->on('products');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipment_items');
    }
};
