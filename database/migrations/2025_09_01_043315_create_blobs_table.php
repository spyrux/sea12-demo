<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('blobs', function (Blueprint $table) {
            $table->ulid('id')->primary();        // or $table->string('id')->primary();
            $table->string('disk');               // e.g. 'public', 's3'
            $table->string('path');               // e.g. 'contracts/abc.pdf'
            $table->string('filename');           // original filename
            $table->string('mime', 191)->nullable();
            $table->unsignedBigInteger('size')->default(0);
            $table->string('hash', 64)->nullable(); // sha256
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('blobs');
    }
};
