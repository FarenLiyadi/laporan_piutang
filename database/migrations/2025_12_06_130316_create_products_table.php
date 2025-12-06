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
        Schema::create('products', function (Blueprint $table) {
             $table->id();

            $table->string('product_code')->unique();
            $table->string('product_name');

            $table->foreignId('brand_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('subcategory_id')->nullable()->constrained()->nullOnDelete();

            $table->foreignId('unit_id')->constrained('units');

            $table->decimal('retail_price', 15, 2)->default(0);

            $table->string('wholesale_code')->nullable();

            $table->timestamps();
            $table->softDeletes(); // <- WAJIB untuk produk
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
