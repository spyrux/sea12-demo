<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->string('type');
            $table->date('tx_date');
            $table->string('external_id')->nullable()->index();
            $table->decimal('total_value', 18, 2)->default(0);

            $table->timestamps();

            // handy composite index for common queries
            $table->index(['tx_date', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
