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
        Schema::create('transaction_parties', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('transaction_id');
            $table->ulid('party_id');
            $table->string('role'); // BUYER, SELLER, CARRIER, etc.
            $table->timestamps();

            $table->foreign('transaction_id')->references('id')->on('transactions')->onDelete('cascade');
            $table->foreign('party_id')->references('id')->on('parties')->onDelete('cascade');
            
            $table->unique(['transaction_id', 'party_id', 'role']);
            $table->index(['transaction_id', 'role']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaction_parties');
    }
};
