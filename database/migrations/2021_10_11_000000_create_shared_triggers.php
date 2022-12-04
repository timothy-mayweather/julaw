<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class CreateSharedTriggers extends Migration
{
    public function __construct()
    {
        $this->connection = config('database.default');
    }

    public function up(): void
    {
        if ($this->connection==='sqlite') {
            $rows = DB::select("select tbl_name from sqlite_master where name like '%user_shift_date';");

            foreach ($rows as $row) {
                DB::unprepared("create trigger if not exists resolve_shift_$row->tbl_name after update on $row->tbl_name for each row when new.user_ is not null
            BEGIN
                update $row->tbl_name set user_shift_date=new.user_||old.shift||((strftime('%s', old.record_date)/86400)+1) where id=old.id;
            END;");
            }
        }
    }

    public function down(): void
    {
        if ($this->connection==='sqlite') {
            $rows = DB::select("select name from sqlite_master where name like 'resolve_shift%';");

            foreach ($rows as $row) {
                DB::unprepared("drop trigger $row->name;");
            }
        }
    }
}
