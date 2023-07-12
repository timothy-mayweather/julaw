<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
//require 'database/traits/Definition.php';
use Database\Traits\Definition;

class CreateChangeTables extends Migration
{
    use Definition;

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
        else{
            $tab = 'employees';
            Schema::create($tab, function (Blueprint $table) {
                $this->mk_provisional($table);
                $table->string('name')->nullable();
                $table->string('phone')->nullable();
                $table->string('email')->nullable();
                $table->foreignId('role')->nullable();
                $table->foreignId('branch_id');
                $table->foreignId('user_id')->nullable();
                $this->defColumn3($table);
                $table->foreign('role')->references('id')->on('employee_roles')->onUpdate('cascade');
                $table->foreign('user_id')->references('id')->on('users')->onUpdate('cascade');
                $table->foreign('branch_id')->references('id')->on('branches')->onUpdate('cascade');
            });
            $this->mk_provisional_trigger($tab);
        }
    }

    public function down(): void
    {
        if ($this->connection === 'pgsql') {
            Schema::dropIfExists('exchange_reg_table');
        }
        else{
            Schema::dropIfExists('employees');
        }
    }
}
