<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('asset_depreciations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('asset_id')->unique();
            $table->enum('method', ['straight_line', 'declining_balance', 'units_of_production']);
            $table->decimal('purchase_price', 12, 2);
            $table->decimal('salvage_value', 12, 2)->default(0);
            $table->unsignedInteger('useful_life_years')->nullable();   // straight_line + declining
            $table->decimal('declining_rate', 5, 2)->nullable();        // declining_balance (e.g. 20.00 = 20%)
            $table->unsignedInteger('total_units')->nullable();         // units_of_production
            $table->unsignedInteger('units_used')->default(0);         // units_of_production
            $table->date('depreciation_start');
            $table->timestamps();

            $table->foreign('asset_id')->references('id')->on('assets')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('asset_depreciations');
    }
};