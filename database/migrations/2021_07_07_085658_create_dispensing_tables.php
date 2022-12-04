<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Database\Traits\Definition;
use Illuminate\Support\Facades\Schema;

class CreateDispensingTables extends Migration
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
        $tab = 'fuel_products';
        Schema::create($tab, function (Blueprint $table) {//---
            $this->mk_provisional($table);
            $table->string('name')->unique();
            $table->string('short_name')->unique();
            $table->string('description')->nullable();
            $this->defColumn1($table);
        });
        $this->mk_provisional_trigger($tab);

        $tab = 'branch_fuel_products';
        Schema::create($tab, function (Blueprint $table) {//---
            $this->mk_provisional($table);
            $table->foreignId('product_id');
            $table->decimal('price',12,2,true);
            $this->defColumn4($table);
            $table->foreign('product_id')->references('id')->on('fuel_products')->onUpdate('cascade');
        });
        $this->mk_provisional_trigger($tab);

        $tab = 'tanks';
        Schema::create($tab, function (Blueprint $table) {//----
            $this->mk_provisional($table);
            $table->string('name');
            $table->decimal('capacity');
            $table->decimal('reserve');
            $table->string('description')->nullable();
            $table->foreignId('fuel_id');
            $this->defColumn4($table);
            $table->unique(['name','branch_id']);
            $table->foreign('fuel_id')->references('id')->on('branch_fuel_products')->onUpdate('cascade');
        });
        $this->mk_provisional_trigger($tab);

        $tab = 'pumps';
        Schema::create($tab, function (Blueprint $table) {//---
            $this->mk_provisional($table);
            $table->string('name');
            $table->string('description')->nullable();
            $this->defColumn4($table);
            $table->unique(['name','branch_id']);
        });
        $this->mk_provisional_trigger($tab);

        $tab = 'nozzles';
        Schema::create($tab, function (Blueprint $table) {//---
            $this->mk_provisional($table);
            $table->string('name');
            $table->foreignId('pump_id');
            $table->foreignId('tank_id');
            $this->defColumn1($table);
            $table->foreign('pump_id')->references('id')->on('pumps')->onUpdate('cascade');
            $table->foreign('tank_id')->references('id')->on('tanks')->onUpdate('cascade');
        });
        $this->mk_provisional_trigger($tab);

        Schema::create('fuel_stock', function (Blueprint $table) {//*
            $this->defColumn6($table,'fuel_stock');
            $table->decimal('unit_price');
            $table->decimal('quantity');
            $table->tinyInteger('stock_no');
            $table->foreignId('supplier_id');
            $table->foreignId('document_id')->nullable();
            $table->foreignId('fuel_id');
            $table->foreign('supplier_id')->references('id')->on('suppliers')->onUpdate('cascade');
            $table->foreign('document_id')->references('id')->on('documents')->onUpdate('cascade');
            $table->foreign('fuel_id')->references('id')->on('branch_fuel_products')->onUpdate('cascade');
        });

        Schema::create('tank_stock', function (Blueprint $table) {//*
            $this->defColumn6($table,'tank_stock');
            $table->decimal('quantity');
            $table->foreignId('tank_id');
            $table->foreignId('stock_id');
            $table->foreign('tank_id')->references('id')->on('tanks')->onUpdate('cascade');
            $table->foreign('stock_id')->references('id')->on('fuel_stock')->onUpdate('cascade');
        });

        Schema::create('dips', function (Blueprint $table) {//*
            $this->defColumn6($table,'dips');
            $table->foreignId('tank_id');
            $table->decimal('opening',12,2,true);
            $table->decimal('closing',12,2,true);
            $table->foreign('tank_id')->references('id')->on('tanks')->onUpdate('cascade');
        });

        Schema::create('meters', function (Blueprint $table) {//*
            $this->defColumn5($table,'meters');
            $table->decimal('opening',12,2,true);
            $table->decimal('rtt',12,2,true);
            $table->decimal('closing',12,2,true);
            $table->decimal('price',12,2,true);
            $table->string('new_price_details')->nullable();
            $table->foreignId('user_id');
            $table->foreignId('nozzle_id');
            $table->foreign('nozzle_id')->references('id')->on('nozzles')->onUpdate('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onUpdate('cascade');
        });

        Schema::create('main_meters', function (Blueprint $table) {//*
            $this->defColumn6($table, 'main_meters');
            $table->decimal('opening',12,2,true);
            $table->decimal('rtt',12,2,true);
            $table->decimal('closing',12,2,true);
            $table->decimal('price',12,2,true);
            $table->string('new_price_details')->nullable();
            $table->decimal('markup', 12, 2, true)->default(0);
            $table->foreignId('nozzle_id');
            $table->foreign('nozzle_id')->references('id')->on('nozzles')->onUpdate('cascade');
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
        Schema::dropIfExists('main_meters');
        Schema::dropIfExists('meters');
        Schema::dropIfExists('dips');
        Schema::dropIfExists('tank_stock');
        Schema::dropIfExists('fuel_stock');
        Schema::dropIfExists('nozzles');
        Schema::dropIfExists('pumps');
        Schema::dropIfExists('tanks');
        Schema::dropIfExists('branch_fuel_products');
        Schema::dropIfExists('fuel_products');
    }
}
