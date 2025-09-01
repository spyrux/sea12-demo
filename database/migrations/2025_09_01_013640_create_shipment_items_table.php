<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('shipment_items', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('shipment_id');
            $table->string('name');
            $table->ulid('transaction_line_id')->nullable();               // item description/name
            $table->integer('quantity')->default(0);
            $table->decimal('unit_price', 14, 2)->default(0);
            $table->string('unit')->nullable();   // e.g., units/kg/boxes
            $table->timestamps();

            $table->foreign('shipment_id')
                  ->references('id')->on('shipments')
                  ->onDelete('cascade');
            $table->foreign('transaction_line_id')
                  ->references('id')->on('transaction_lines')
                  ->onDelete('cascade');

            $table->index('shipment_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shipment_items');
    }
};

