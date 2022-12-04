<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class DashboardController extends Controller
{
    use Helpers;
    public function create(): \Inertia\Response
    {
//        $b=$request->user()->branch_id;
//        $bi=$request->user()->branch_id.$this->date_to_int($request->data_date);
//        $resp = match ($val) {
//            'estFuel' => DB::select("select name, shortname, capacity, closing, rem, ((rem+0.00)/(capacity+0.00))*100 as per, dip_id from
//                        (select t.id, upper(t.name) as name, upper(fp.short_name) as shortname, t.capacity, ifnull(d.closing,0) as closing, case when d.branch_int_date<=" . $bi . " then ifnull(d.closing,0) when ts.branch_int_date=" . $bi . " then sum(ts.quantity)+ifnull(d.closing,0) else ifnull(d.closing,0) end as rem, ifnull(max(d.id),t.id*-10) as dip_id from tanks t inner join branch_fuel_products bfp on bfp.id = t.fuel_id inner join fuel_products fp on fp.id = bfp.product_id left join dips d on t.id=d.tank_id left join tank_stock ts on t.id = ts.tank_id where ts.branch_int_date=" . $bi . " or t.branch_id=" . $b . " group by t.id);"),
//
//            'todayFuel' => DB::select("select upper(m1.name) as name, m1.litres as l1, m2.litres as l2, case when m1.litres>0 then m1.litres else m2.litres end as litres from
//                            (select t.id, case when m.branch_int_date==".$bi." then sum(m.closing-m.rtt-m.opening) else 0 end as litres, t.name from nozzles n left join main_meters m on n.id = m.nozzle_id inner join tanks t on t.id = n.tank_id where m.branch_int_date=".$bi." or t.branch_id=".$b." group by t.name) m1 left join
//                            (select t.id, case when m.branch_int_date==".$bi." then sum(m.closing-m.rtt-m.opening) else 0 end as litres, t.name from nozzles n left join meters m on n.id = m.nozzle_id inner join tanks t on t.id = n.tank_id where m.branch_int_date=".$bi." or t.branch_id=".$b." group by t.name) m2 on m1.litres=0 and m1.id=m2.id;"),
//            default => null,
//        };
//        return Response($resp);
      return Inertia::render('Dash');
    }
}
