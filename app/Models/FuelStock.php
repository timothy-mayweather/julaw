<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

/**
 * @method static create(array $array)
 * @method static orderBy(string $string)
 * @method static addSelect(array $array)
 * @method static find(int $id)
 * @method static where(string $string, $id)
 * @method static select(string $string)
 */
class FuelStock extends Model
{
    use HasFactory;
    public $timestamps = true;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        //'id',
        'user_',
        'user_d',
        'unit_price',
        'quantity',
        'stock_no',
        'readonly',
        'supplier_id',
        'document_id',
        'fuel_id',
        'branch_id',
        'record_date',
        'branch_int_date',
        'unique_int',
        'dependents',
        'created_at',
        'updated_at',
        'deleted_at'
    ];
    /**
     * The attributes that have default values
     *
     * @var array
     */
    protected $attributes = [
        'readonly' => 0,
    ];

    protected $table = 'fuel_stock';
}
