<?php

namespace Database\Traits;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

trait Definition{

    public function mk_provisional(Blueprint $table):void{
        ($this->connection === 'sqlite')?$table->bigInteger('id')->primary():$table->id();
        $table->uuid('provisional')->nullable();
    }

    public function mk_provisional_trigger(string $tab):void{
        if ($this->connection === 'pgsql') {
            DB::unprepared('create trigger provisional_' . $tab . ' after insert on ' . $tab . ' for each row execute function reconcile_id();');
        }
        else{
            DB::unprepared("create trigger if not exists provisional_".$tab." after insert on ".$tab." for each row when new.provisional is not null
            BEGIN
                insert into decrementing_id_seq (table_name, seq) values ('".$tab."', -1) on conflict do update set seq=seq-1;
                update ".$tab." set id=(select seq from decrementing_id_seq where table_name='".$tab."') where id=new.id;
                insert into action_resolution (uuid_pk, table_name, current_id) VALUES (new.provisional, '".$tab."', (select seq from decrementing_id_seq where table_name='".$tab."'));
            END;");

            DB::unprepared("create trigger if not exists reconcile_id_".$tab." after update on action_resolution for each row when old.table_name='".$tab."' and new.proposed_id is not null
            BEGIN
                update ".$tab." set id=new.proposed_id, provisional=null where id=old.current_id;
                delete from action_resolution where uuid_pk=new.uuid_pk;
            END;");
        }
    }

    public function defColumn1 (Blueprint $table): void{
        $table->enum('active',['No','Yes'])->nullable()->default('Yes');
        $table->foreignId('user_');
        $table->foreignId('user_d')->nullable();
        $table->timestamp('created_at')->useCurrent();
        $table->timestamp('updated_at')->useCurrent();
        $table->softDeletes();
        $table->foreign('user_')->references('id')->on('users')->onUpdate('cascade');
        $table->foreign('user_d')->references('id')->on('users')->onUpdate('cascade');
    }

    public function defColumn2 (Blueprint $table): void
    {
        $table->foreignId('user_');
        $table->foreignId('branch_id');
        $table->foreignId('user_d')->nullable();
        $table->timestamp('created_at')->useCurrent();
        $table->timestamp('updated_at')->useCurrent();
        $table->softDeletes();
        $table->foreign('user_')->references('id')->on('users')->onUpdate('cascade');
        $table->foreign('user_d')->references('id')->on('users')->onUpdate('cascade');
        $table->foreign('branch_id')->references('id')->on('branches');
    }

    public function defColumn3 (Blueprint $table): void
    {
        $table->enum('active',['No','Yes'])->nullable()->default('Yes');
        $table->foreignId('user_')->nullable();
        $table->foreignId('user_d')->nullable();
        $table->timestamp('created_at')->useCurrent();
        $table->timestamp('updated_at')->useCurrent();
        $table->foreign('user_')->references('id')->on('users')->onUpdate('cascade');
        $table->foreign('user_d')->references('id')->on('users')->onUpdate('cascade');
        $table->softDeletes();
    }

    public function defColumn4 (Blueprint $table): void
    {
        $table->enum('active',['No','Yes'])->nullable()->default('Yes');
        $table->foreignId('user_');
        $table->foreignId('branch_id');
        $table->foreign('branch_id')->references('id')->on('branches');
        $table->foreignId('user_d')->nullable();
        $table->timestamp('created_at')->useCurrent();
        $table->timestamp('updated_at')->useCurrent();
        $table->softDeletes();
        $table->foreign('user_')->references('id')->on('users')->onUpdate('cascade');
        $table->foreign('user_d')->references('id')->on('users')->onUpdate('cascade');
    }

    public function defColumn5 (Blueprint $table, string $table_name): void
    {
        $table->id();
        $table->foreignId('user_');
        $table->foreignId('branch_id');
        $table->foreignId('user_d')->nullable();
        $table->timestamp('created_at')->useCurrent();
        $table->timestamp('updated_at')->useCurrent();
        $table->softDeletes();
        $table->tinyInteger('readonly')->default(0);
        $table->integer('shift');
        $table->unsignedBigInteger('branch_int_date');
        $table->date('record_date');
        if ($this->connection === 'sqlite') {
            $table->bigInteger('master_id')->nullable();
        }
        $table->unsignedBigInteger('user_shift_date');
        $table->index('branch_int_date',$table_name.'_branch_int_date');
        $table->index('record_date',$table_name.'_record_date');
        $table->index('user_shift_date',$table_name.'_user_shift_date');
        $table->unsignedBigInteger('unique_int')->unique();
        $table->foreign('user_')->references('id')->on('users')->onUpdate('cascade');
        $table->foreign('user_d')->references('id')->on('users')->onUpdate('cascade');
        $table->foreign('branch_id')->references('id')->on('branches');
    }

    public function defColumn6(Blueprint $table, string $table_name): void
    {
        $table->id();
        $table->foreignId('user_');
        $table->foreignId('branch_id');
        $table->foreignId('user_d')->nullable();
        $table->timestamp('created_at')->useCurrent();
        $table->timestamp('updated_at')->useCurrent();
        $table->softDeletes();
        $table->tinyInteger('readonly')->default(0);
        $table->unsignedBigInteger('branch_int_date');
        $table->date('record_date');
        $table->index('branch_int_date',$table_name.'_branch_int_date');
        $table->index('record_date',$table_name.'_record_date');
        if ($this->connection === 'sqlite') {
            $table->bigInteger('master_id')->nullable();
        }
        $table->unsignedBigInteger('unique_int')->unique();
        $table->foreign('user_')->references('id')->on('users')->onUpdate('cascade');
        $table->foreign('user_d')->references('id')->on('users')->onUpdate('cascade');
        $table->foreign('branch_id')->references('id')->on('branches');
    }

    public function mk_tables($name, $call): void
    {
        Schema::create($name, function (Blueprint $table) use ($name, $call) {
            $this->defColumn5($table, $name);
            $call($table);
        });

        $name = 'main_'.$name;
        Schema::create($name, function (Blueprint $table) use ($name, $call) {
            $this->defColumn6($table, $name);
            $call($table);
        });
    }
}
