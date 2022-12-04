<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

/**
 * @method static create(array $array)
 * @method static where(string $string, int $branch_id)
 * @method static find(int $id)
 * @method static select(string $string)
 */
class BranchFuelProduct extends Pivot
{
    public $timestamps = true;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        //'id',
        'branch_id',
        'product_id',
        'user_',
        'user_d',
        'active',
        'created_at',
        'updated_at',
        'deleted_at',
        'price',
    ];

    /**
     * The attributes that have default values
     *
     * @var array
     */
    protected $attributes = [
        'active' => 'Yes',
    ];

    protected $table = 'branch_fuel_products';

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class,'branch_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(FuelProduct::class,'product_id');
    }
}
