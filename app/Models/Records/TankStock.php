<?php

namespace App\Models\Records;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @method static create(array $array)
 * @method static orderBy(string $string)
 * @method static addSelect(array $array)
 * @method static find(int $id)
 * @method static where(string $string, $id)
 * @method static select(string $string)
 */
class TankStock extends Model
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
        'quantity',
        'readonly',
        'tank_id',
        'stock_id',
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

    protected $table = 'tank_stock';
}
