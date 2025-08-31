<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transaction_lines', function (Blueprint $table) {
            $table->ulid('id')->primary();

            // FKs
            $table->foreignUlid('transaction_id')
                  ->constrained('transactions')
                  ->cascadeOnDelete();

            $table->foreignUlid('product_id')
                  ->nullable()
                  ->constrained('products');

            // (optional) stable ordering per transaction
            $table->unsignedInteger('line_number')->nullable();

            // amounts (USD implied)
            $table->decimal('quantity', 18, 2);
            $table->decimal('unit_price', 18, 2);
            $table->decimal('line_value', 18, 2);

            $table->timestamps();

            // indexes / constraints
            $table->index(['transaction_id', 'product_id']);
            $table->unique(['transaction_id', 'line_number']); // if you use line_number
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transaction_lines');
    }
};
