<?php

use Ramsey\Uuid\Uuid;
use App\Models\AccessRight;
use App\Models\AccessRightDetail;
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
        Schema::create('access_right_detail', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->char('access_id', 36);
            $table->string('access_code', 5);
            $table->tinyInteger('c')->default(0);
            $table->tinyInteger('r')->default(0);
            $table->tinyInteger('u')->default(0);
            $table->tinyInteger('d')->default(0);
            $table->char('created_by' , 36);
            $table->char('updated_by' , 36)->nullable();
            $table->char('deleted_by' , 36)->nullable();
            $table->datetime('deleted_at')->nullable();
            $table->timestamps();

            $table->foreign('access_id')->references('id')->on('access_right');
        });

        $access_right = AccessRight::where('access_name', 'Superadminaccess')->first();

        AccessRightDetail::create([
            "id"            => Uuid::uuid1(),
            "access_id"     => $access_right->id,
            "access_code"   => "011",
            "c"             => 1,
            "r"             => 1,
            "u"             => 1,
            "d"             => 1,
            "created_by"    => "System",
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('access_right_detail');
    }
};
