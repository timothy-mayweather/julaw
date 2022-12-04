<?php

namespace App\Http\Controllers;

use App\Models\BranchCustomer;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class BranchCustomerController extends CommonPivot
{
    use Helpers;
    public string $modelClass = BranchCustomer::class;
    public string $mainModelClass = Customer::class;
    public string $refName = 'customer_id';

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return Response
     */
    public function store(Request $request): Response
    {
        $validator = Validator::make($request->all(), [
            'description' => 'nullable|string',
            'debtor' => 'required',
            'prepaid' => 'required',
        ]);

        if ($validator->fails()) {
            return Response($validator->errors());
        }

        $stored = BranchCustomer::create([
            'customer_id' => $request->model,
            'branch_id' => $request->branch,
            'description' => $request->description,
            'debtor' => $request->debtor,
            'prepaid' => $request->prepaid,
            'active' => $request->active,
            'user_' => $request->user()->id,
        ]);
        return Response($stored->id ?? -1);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param string $id
     * @return Response
     */
    public function update(Request $request, string $id): Response
    {
        if($request->has('active')){
            $key = 'active';
        }
        else if($request->has('debtor')){
            $key = 'debtor';
        }
        else if($request->has('prepaid')){
            $key = 'prepaid';
        }
        else{
            $key = 'description';
        }
        $product = BranchCustomer::find($id);
        $product[$key] = $request->input($key);
        $product['user_'] = $request->user()->id;
        $response = $product->save();
        return Response($response);
    }

    /**
     * Display the specified resource.
     *
     * @param Request $request
     * @param string $val
     * @return Response
     */
    public function show(Request $request,string $val): Response
    {
        if(str_starts_with($val,'_')){
            $b=$request->user()->branch_id;
            $bi=$request->user()->branch_id.$this->date_to_int($request->data_date);
            if($request->user()->manager==="No") {
                $selected = DB::select("select bc.id, c.short as name from branch_customers bc inner join customers c on c.id = bc.customer_id where bc.branch_id=".$request->user()->branch_id);
            }
            else{

                $selected = DB::select("select n.id, max(ifnull(m.id,n.id*-1000)) as meter_id, max(ifnull(mm.id,n.id*-1000)) as mmeter_id, ifnull(m.nozzle_id,n.id) as nozzle_, max(ifnull(mm.closing,0)) as opening, case when m.branch_int_date==".$bi." then max(m.closing) else 0 end as closing,
                                            case when m.branch_int_date==".$bi." then sum(m.rtt) else 0 end as rtt, n.name, case when m.branch_int_date==".$bi." then m.price else bfp.price end as price, bfp.id as fuel from nozzles n left join meters m on n.id = m.nozzle_id
                                            left join main_meters mm on n.id = mm.nozzle_id inner join tanks t on t.id = n.tank_id inner join branch_fuel_products bfp on bfp.id = t.fuel_id where bfp.branch_id=".$b." group by nozzle_;");
            }
            return Response($selected);
        }
        return parent::show($request, $val);
    }
}
