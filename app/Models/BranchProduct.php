<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

/**
 * @method static create(array $array)
 * @method static where(string $string, int $branch_id)
 * @method static find(int $id)
 * @method static select(string $string)
 */
class BranchProduct extends Pivot
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
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

    protected $table = 'branch_products';

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class,'branch_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class,'product_id');
    }

}
