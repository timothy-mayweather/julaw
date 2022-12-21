<?php

namespace App\Models\BranchAffiliated;

use App\Models\Registry\Customer;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class BranchCustomer extends Pivot
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'debtor',
        'prepaid',
        'description',
        'branch_id',
        'customer_id',
        'active',
        'user_',
        'user_d',
        'created_at',
        'updated_at',
        'deleted_at',
        'provisional'
    ];

    const defaultData = [
        'active'=>'Yes',
        'debtor' => 'Yes',
        'prepaid'=> 'No',
    ];

    const refIdName = 'customer_id';
    const refName = 'short';


    /**
     * The attributes that have default values
     *
     * @var array
     */
    protected $attributes = [
        'debtor' => 'Yes',
        'prepaid'=> 'No',
        'active' => 'Yes',
    ];

    protected $table = 'branch_customers';

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class,'branch_id');
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class,'customer_id');
    }
}
