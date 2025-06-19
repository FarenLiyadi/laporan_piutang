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
        Schema::create('user_activities', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('username' , 255);
            $table->string('description');
            $table->tinyInteger('activity_type')->comment('1 create, 2 update, 3 delete, 4 other');
            $table->json('old_data')->nullable();
            $table->json('new_data')->nullable();
            $table->char('created_by' , 36);
            $table->timestamps();

            // Indexing
            $table->index('username', 'idx_username');
            $table->index('created_by', 'idx_created_by');
            $table->index('created_at', 'idx_created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_activities');
    }
};
