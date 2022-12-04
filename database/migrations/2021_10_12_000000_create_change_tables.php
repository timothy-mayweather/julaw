<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChangeTables extends Migration
{
    public function __construct()
    {
        $this->connection = config('database.default');
    }

    public function up(): void
    {
        if ($this->connection === 'pgsql') {
            Schema::create('exchange_reg_table', static function (Blueprint $table) {
                $table->id();
                $table->string('branch_id_tab')->unique();
                $table->unsignedTinyInteger('status')->default(0);
                $table->unsignedTinyInteger('action')->default(0);
                $table->bigInteger('last_id')->default(0);
                $table->string('file_name')->nullable();
                $table->string('integrity_key')->nullable();
                $table->text('updated_ids')->default('');
            });
        }
    }

    public function down(): void
    {
        if ($this->connection === 'pgsql') {
            Schema::dropIfExists('exchange_reg_table');
        }
    }
}
