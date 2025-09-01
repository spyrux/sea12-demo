<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contracts', function (Blueprint $table) {
            $table->ulid('id')->primary();          // id ulid [pk]
            $table->string('blob_id');              // blob_id varchar
            $table->ulid('transaction_id');         // transaction_id ulid
            $table->timestamps();

            // FK -> transactions.id (ULID), cascade on delete
            $table->foreign('transaction_id')
                  ->references('id')->on('transactions')
                  ->cascadeOnDelete();

            // Optional indexes if you’ll search by these often:
            $table->index('blob_id');
            $table->index('transaction_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contracts');
    }
};
