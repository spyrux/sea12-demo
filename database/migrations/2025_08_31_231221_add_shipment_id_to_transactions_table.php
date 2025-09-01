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
        Schema::table('transactions', function (Blueprint $table) {
            $table->ulid('shipment_id')->nullable()->after('total_value');
            $table->foreign('shipment_id')->references('id')->on('shipments')->onDelete('cascade');
            $table->index('shipment_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropForeign(['shipment_id']);
            $table->dropIndex(['shipment_id']);
            $table->dropColumn('shipment_id');
        });
    }
};
