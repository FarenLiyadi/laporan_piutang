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
        Schema::create('invoices', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('customer_id');
            $table->foreign('customer_id')->references('id')->on('customers');
            $table->uuid('sales_id')->nullable();
            $table->foreign('sales_id')->references('id')->on('sales');
            $table->string('nomor_invoice')->unique();
            $table->decimal('grand_total', 15, 2);
            $table->date('jatuh_tempo');
            $table->text('catatan')->nullable();
            $table->decimal('total_bayar', 15, 2)->default(0);
            $table->tinyInteger('is_deleted')->default(0);
            $table->char('created_by' , 36);
            $table->char('updated_by' , 36)->nullable();
            $table->char('deleted_by' , 36)->nullable();
            $table->datetime('deleted_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
