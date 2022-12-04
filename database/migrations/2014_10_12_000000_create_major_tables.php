<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
require 'database/traits/Definition.php';
use Database\Traits\Definition;

class CreateMajorTables extends Migration
{
    use Definition;
    /**
     * Run the migrations.
     *
     * @return void
     */

    public function __construct()
    {
        $this->connection = config('database.default');
    }

    public function up(): void
    {
        //TODO Initially, insert general branch for root and other major users
        if ($this->connection === 'pgsql') {
            DB::unprepared("create or replace function reconcile_id() RETURNS trigger as $$
            begin
                if NEW.provisional is not null then
                    update action_resolution set proposed_id=NEW.id where uuid_pk=NEW.provisional;
                    execute 'update '||quote_ident(TG_TABLE_NAME)||' set provisional=null where id='||NEW.id;
                end if;
                return NEW;
            end
            $$ LANGUAGE plpgsql;");
        }
        else{
            Schema::create('decrementing_id_seq', static function (Blueprint $table){
                $table->text('table_name')->primary();
                $table->bigInteger('seq')->default(0);
            });

            Schema::create('batches', static function (Blueprint $table){
                $table->id();
                $table->uuid('batch_id');
                $table->bigInteger('last_id');
            });

        }

        Schema::create('action_resolution', function (Blueprint $table){//----
            $table->id();
            $table->uuid('uuid_pk')->unique();
            $table->string('table_name');
            $table->bigInteger('current_id');
            $table->bigInteger('proposed_id')->nullable();
            $table->string('action')->default('insert');
            if ($this->connection === 'pgsql') {
                $table->uuid('batch_id');
                $table->index('batch_id','batch_id');
            }else{
                $table->uuid('batch_id')->nullable();
            }
        });

        Schema::create('branches', function (Blueprint $table) {//----
            ($this->connection === 'sqlite')?$table->bigInteger('id')->primary():$table->id();
            $table->string('name')->unique();
            $table->string('location');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();
            $table->softDeletes();
        });

        $tab = 'users';
        Schema::create($tab, function (Blueprint $table) {//----
            $this->mk_provisional($table);
            $table->string('name');
            $table->string('phone')->unique();
            $table->string('email')->unique();
            if ($this->connection === 'sqlite') {
                $table->enum('manager', ['No', 'Yes', 'Root'])->default('No');
            }else{
                $table->enum('manager', ['No', 'Yes', 'Root','Client'])->default('No');
            }
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->foreignId('branch_id');
            $this->defColumn3($table);
            $table->foreign('branch_id')->references('id')->on('branches')->onUpdate('cascade');
        });
        $this->mk_provisional_trigger($tab);

        $tab = 'employees';
        Schema::create($tab, function (Blueprint $table) {//----
            $this->mk_provisional($table);
            $table->string('name');
            $table->string('phone');
            $table->string('email')->nullable();
            $table->foreignId('branch_id');
            $table->foreignId('user_id')->nullable();
            $this->defColumn3($table);
            $table->foreign('user_id')->references('id')->on('users')->onUpdate('cascade');
            $table->foreign('branch_id')->references('id')->on('branches')->onUpdate('cascade');
        });
        $this->mk_provisional_trigger($tab);

        $tab = 'product_types';
        Schema::create($tab, function (Blueprint $table) {//----
            $this->mk_provisional($table);
            $table->string('type')->unique();
            $table->foreignId('user_');
            $table->foreignId('user_d')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();
            $table->softDeletes();
            $table->foreign('user_d')->references('id')->on('users')->onUpdate('cascade');
            $table->foreign('user_')->references('id')->on('users')->onUpdate('cascade');
        });
        $this->mk_provisional_trigger($tab);

        $tab = 'products';
        Schema::create($tab, function (Blueprint $table) {//----
            $this->mk_provisional($table);
            $table->string('name')->unique();
            $table->string('short_name')->unique();
            $table->foreignId('type');
            $table->string('description')->nullable();
            $this->defColumn3($table);
            $table->foreign('type')->references('id')->on('product_types')->onUpdate('cascade');
        });
        $this->mk_provisional_trigger($tab);

        $tab = 'branch_products';
        Schema::create($tab, function (Blueprint $table) {//----
            $this->mk_provisional($table);
            $table->decimal('price',12,2,true);
            $table->foreignId('product_id');
            $this->defColumn4($table);
            $table->foreign('product_id')->references('id')->on('products')->onUpdate('cascade');
        });
        $this->mk_provisional_trigger($tab);

        $tab = 'receivable_types';
        Schema::create($tab, function (Blueprint $table) {//----
            $this->mk_provisional($table);
            $table->string('name')->unique();
            $table->string('description')->nullable();
            $this->defColumn1($table);
        });
        $this->mk_provisional_trigger($tab);

        $tab = 'branch_receivable_types';
        Schema::create($tab, function (Blueprint $table) {//----
            $this->mk_provisional($table);
            $table->foreignId('recv_id');
            $this->defColumn4($table);
            $table->foreign('recv_id')->references('id')->on('receivable_types')->onUpdate('cascade');
        });
        $this->mk_provisional_trigger($tab);

        $tab = 'expense_types';
        Schema::create($tab, function (Blueprint $table) {//----
            $this->mk_provisional($table);
            $table->string('name')->unique();
            $table->string('description')->nullable();
            $this->defColumn1($table);
        });
        $this->mk_provisional_trigger($tab);

        $tab = 'branch_expense_types';
        Schema::create($tab, function (Blueprint $table) {//----
            $this->mk_provisional($table);
            $table->foreignId('exp_id');
            $this->defColumn4($table);
            $table->foreign('exp_id')->references('id')->on('expense_types')->onUpdate('cascade');
        });
        $this->mk_provisional_trigger($tab);

        $tab = 'transaction_types';
        Schema::create($tab, function (Blueprint $table) {//----
            $this->mk_provisional($table);
            $table->string('name')->unique();
            $table->string('description')->nullable();
            $this->defColumn1($table);
        });
        $this->mk_provisional_trigger($tab);

        $tab = 'branch_transaction_types';
        Schema::create($tab, function (Blueprint $table) {//----
            $this->mk_provisional($table);
            $table->foreignId('tr_id');
            $this->defColumn4($table);
            $table->foreign('tr_id')->references('id')->on('transaction_types')->onUpdate('cascade');
        });
        $this->mk_provisional_trigger($tab);

        $tab = 'customers';
        Schema::create($tab, function (Blueprint $table) {//----
            $this->mk_provisional($table);
            $table->string('name')->unique();
            $table->string('short')->unique();
            $this->defColumn1($table);
        });
        $this->mk_provisional_trigger($tab);

        $tab = 'branch_customers';
        Schema::create($tab, function (Blueprint $table) {//----
            $this->mk_provisional($table);
            $table->foreignId('customer_id');
            $this->defColumn4($table);
            $table->enum('debtor',['No','Yes'])->default('Yes');
            $table->enum('prepaid',['No','Yes'])->default('No');
            $table->string('description')->nullable();
            $table->foreign('customer_id')->references('id')->on('customers')->onUpdate('cascade');
        });
        $this->mk_provisional_trigger($tab);

        //TODO let suppliers, users and branches be registered online
        $tab = 'suppliers';
        Schema::create($tab, function (Blueprint $table) {//----
            $this->mk_provisional($table);
            $table->string('name')->unique();
            $table->string('location');
            $table->string('description')->nullable();
            $table->string('phone')->unique();
            $table->string('email')->unique();
            $this->defColumn1($table);
        });
        $this->mk_provisional_trigger($tab);

        Schema::create('documents', function (Blueprint $table) {//*
            $table->id();
            $table->string('name');
            $table->string('path');
            $table->date('record_date');
            $table->string('description')->nullable();
            $table->unsignedBigInteger('branch_int_date');
            $table->index('record_date','record_date');
            $table->index('branch_int_date','branch_int_date');
            $this->defColumn2($table);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        $connection = config('database.default');
        if ($connection !== 'pgsql' && $connection !== 'sqlite') { return; }
        Schema::dropIfExists('documents');
        Schema::dropIfExists('suppliers');
        Schema::dropIfExists('branch_customers');
        Schema::dropIfExists('customers');
        Schema::dropIfExists('branch_transaction_types');
        Schema::dropIfExists('transaction_types');
        Schema::dropIfExists('branch_expense_types');
        Schema::dropIfExists('expense_types');
        Schema::dropIfExists('branch_receivable_types');
        Schema::dropIfExists('receivable_types');
        Schema::dropIfExists('branch_products');
        Schema::dropIfExists('products');
        Schema::dropIfExists('product_types');
        Schema::dropIfExists('employees');
        Schema::dropIfExists('users');
        Schema::dropIfExists('branches');
        Schema::dropIfExists('action_resolution');
        if ($this->connection === 'pgsql') {
            DB::unprepared('drop function reconcile_id();');
        }else{
            Schema::dropIfExists('decrementing_id_seq');
            Schema::dropIfExists('batches');
        }
    }
}
