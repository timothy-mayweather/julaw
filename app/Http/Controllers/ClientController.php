<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ClientController extends Controller
{
    use Helpers;
    public function register(Request $request): Response
    {
        if ($request->user()->manager === "Yes") {
            $name = Branch::find($request->user()->branch_id)->name;
            $new_email = $name."client@julaw.com";
            $us = User::where('email', $new_email)->get();

            if (count($us)===0){
                $user = new User([
                    'name' => $name."-client",
                    'email' => $new_email,
                    'phone' => '-'. hrtime(true),
                    'password' => Hash::make(Str::uuid()->toString()),
                    'branch_id' => $request->user()->branch_id,
                    'active' => 'No',
                ]);
                $user->save();
                $us = User::where('email', $new_email)->get();
            }
            $us[0]->tokens()->delete();
            $token = $us[0]->createToken(Str::random(40));

            return Response([
                'token' => $token->plainTextToken,
            ]);
        }
        return Response(null);
    }

    public function authReq(Request $request): bool
    {
        if (str_contains($request->user()->email, "client@julaw.com")){
            return true;
        }
        return false;
    }



    public function write_exchange(string $status, array $data, string $filename, string $integrity):void
    {
        if($status==="init"){
            foreach ($data as $datum){
                $prepared_sql = "insert into exchange_reg_table (branch_id_tab, last_id, file_name, integrity_key)
                values ('".$datum[0]."',".$datum[1].",'".$filename."','$integrity') on conflict on constraint exchange_reg_table_branch_id_tab_unique do update set
                last_id=$datum[1], file_name='".$filename."', integrity_key='".$integrity."', status=0, action=0, updated_ids='';";
                DB::insert($prepared_sql);
            }
        }
    }

    /**
     * @throws \JsonException
     */
    public function send_init_major(Request $request): Response | StreamedResponse
    {
        if (!$this->authReq($request)){
            return Response("unauthorized!");
        }

        $data = [];
        if ($request->status === "create") {
            $br_id = $request->user()->branch_id;
            $data["branches"] = DB::select("select id, name, location from branches where id=".$br_id);
            $data["users"] = DB::select("select id, name, phone, email, manager, email_verified_at, password, branch_id, active from users where branch_id=".$br_id);
            $data["employees"] = DB::select("select id, name, phone, email, branch_id, user_id, active, user_, user_d from employees where branch_id=".$br_id);
            $data["product_types"] = DB::select("select id, type, user_, user_d from product_types");
            $data["products"] = DB::select("select id, name, short_name, type, description, active, user_, user_d from products");
            $data["branch_products"] = DB::select("select id, price, product_id, active, user_, branch_id, user_d from branch_products where branch_id=".$br_id);
            $data["receivable_types"] = DB::select("select id, name, description, active, user_, user_d from receivable_types");
            $data["branch_receivable_types"] = DB::select("select id, recv_id, active, user_, branch_id, user_d from branch_receivable_types where branch_id=".$br_id);
            $data["expense_types"] = DB::select("select id, name, description, active, user_, user_d from expense_types");
            $data["branch_expense_types"] = DB::select("select id, exp_id, active, user_, branch_id, user_d from branch_expense_types where branch_id=".$br_id);
            $data["transaction_types"] = DB::select("select id, name, description, active, user_, user_d from transaction_types");
            $data["branch_transaction_types"] = DB::select("select id, tr_id, active, user_, branch_id, user_d from branch_transaction_types where branch_id=".$br_id);
            $data["customers"] = DB::select("select id, name, short, active, user_, user_d from customers");
            $data["branch_customers"] = DB::select("select id, customer_id, active, user_, branch_id, user_d from branch_customers where branch_id=".$br_id);
            $data["suppliers"] = DB::select("select id, name, location, description, phone, email, active, user_, user_d from suppliers");
            $data["fuel_products"] = DB::select("select id, name, short_name, description, active, user_, user_d from fuel_products");
            $data["branch_fuel_products"] = DB::select("select id, price, product_id, active, user_, branch_id, user_d from branch_fuel_products where branch_id=".$br_id);
            $data["tanks"] = DB::select("select id, name, capacity, reserve, description, fuel_id, active, user_, branch_id, user_d from tanks where branch_id=".$br_id);
            $data["pumps"] = DB::select("select id, name, description, active, user_, branch_id, user_d from pumps where branch_id=".$br_id);
            $data["nozzles"] = DB::select("select id, name, pump_id, tank_id, active, user_, user_d from nozzles");

            $exchanged = [];
            foreach ($data as $key=>$value){
                if(count($value)>0) {
                    $exchanged[] = [$br_id."_".$key, end($value)->id];
                }else{
                    $exchanged[] = [$br_id."_".$key, 0];
                }
            }
            $exchanged = array_slice($exchanged,1);
            Storage::disk('local')->put($request->filename.".json", json_encode($data, JSON_THROW_ON_ERROR));
            $integrity = md5_file(Storage::path($request->filename.".json"));
            $this->write_exchange("init", $exchanged, $request->filename.".json", $integrity);
            Return Response($integrity);
        }

        if ($request->status === "get") {
            return Storage::download($request->filename.".json");
        }

        if ($request->status === "integrity"){
            return Response(md5_file(Storage::path($request->filename.".json")));
        }

        Storage::delete($request->filename.".json");
        return Response("done");
    }


    /**
     * @throws \JsonException
     */
    public function send_init_minor(Request $request): Response | StreamedResponse
    {
        if (!$this->authReq($request)){
            return Response("unauthorized!");
        }

        if ($request->status === "create") {
            $br = $request->user()->branch_id;
            $curr_date = $this->date_to_int(date("Y-m-d"));
            $start_date = $this->date_to_int(date("Y-06-30"));
            $diff = $curr_date - $start_date;
            if ($diff < 0) {
                $prev_yr = ((int)date("Y")) - 1;
                $start_date = $this->date_to_int(date("" . $prev_yr . "-06-30"));
            } elseif ($diff < 90) {
                $start_date = $curr_date - 91;
            }
            $br_start_date = $br . $start_date;
            $stop_date = (((int)$br) + 1) * 10 ** (strlen($br_start_date) - strlen($br));

            $data['main_meters'] = "select id, user_, branch_id, user_d, deleted_at, readonly, branch_int_date, record_date, unique_int, opening, rtt, closing, price, new_price_details, markup, nozzle_id from main_meters where branch_int_date>$br_start_date and branch_int_date<$stop_date;";
            $data['meters'] = "select id, user_, branch_id, user_d, deleted_at, readonly, shift, branch_int_date, record_date, user_shift_date, unique_int, opening, rtt, closing, price, new_price_details, user_id, nozzle_id from meters where branch_int_date>$br_start_date and branch_int_date<$stop_date;";
            $tables = explode( ',',$request->tables);

            $tr = [];
            $exchanged = [];
            foreach ($tables as $table){
                $tr[$table] = DB::select($data[$table]);
                if(count($tr[$table])>0) {
                    $exchanged[] = [$br."_".$table, end($tr[$table])->id];
                }else{
                    $exchanged[] = [$br."_".$table, 0];
                }
            }

            Storage::disk('local')->put($request->filename.".json", json_encode($tr, JSON_THROW_ON_ERROR));
            $integrity = md5_file(Storage::path($request->filename.".json"));
            $this->write_exchange("init", $exchanged, $request->filename.".json", $integrity);
            Return Response($integrity);
        }
        if ($request->status === "get") {
            return Storage::download($request->filename.".json");
        }

        if ($request->status === "integrity"){
            return Response(md5_file(Storage::path($request->filename.".json")));
        }

        Storage::delete($request->filename.".json");
        return Response("done");
    }


    public function receive(Request $request): Response
    {
        if (!$this->authReq($request)){
        return Response("unauthorized!");
        }
        Return Response([$request->user()->name]);
    }

}
