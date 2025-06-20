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
        Schema::create('kos', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('address');
            $table->text('location');
            $table->text('includes');
            $table->integer('capacity')->default(1);
            $table->text('nearby_facilities')->nullable();
            $table->decimal('price_per_month', 10, 2);
            $table->json('images')->nullable();
            $table->string('contact_whatsapp')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kos');

        Schema::table('kos', function (Blueprint $table) {
        $table->dropColumn('capacity');
        });
    }
};
