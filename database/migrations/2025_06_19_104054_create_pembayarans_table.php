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
        Schema::create('pembayarans', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('invoice_id');
            $table->foreign('invoice_id')->references('id')->on('invoices');
            $table->foreignId('akun_bank_id')->constrained('akun_banks');
            $table->decimal('nominal', 15, 2);
            $table->text('catatan')->nullable();
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
        Schema::dropIfExists('pembayarans');
    }
};
