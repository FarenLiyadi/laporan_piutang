<?php

use Ramsey\Uuid\Uuid;
use App\Models\AccessRight;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('access_right', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('access_name' , 255);
            $table->tinyInteger('is_deleted')->default(0);
            $table->char('created_by' , 36);
            $table->char('updated_by' , 36)->nullable();
            $table->char('deleted_by' , 36)->nullable();
            $table->datetime('deleted_at')->nullable();
            $table->timestamps();

            // Indexing
            $table->index('access_name', 'idx_access_name');
        });

        AccessRight::create([
            "id"            => Uuid::uuid1(),
            "access_name"   => "Superadminaccess",
            "created_by"    => "System",
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('access_right');
    }
};
