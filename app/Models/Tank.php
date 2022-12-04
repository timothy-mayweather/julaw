<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

/**
 * @method static create(array $array)
 * @method static addSelect(array $array)
 * @method static find(int $id)
 * @method static where(array[] $array)
 * @method static select(string[] $array)
 */
class Tank extends Model
{
    public $timestamps = true;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        //'id',
        'capacity',
        'reserve',
        'name',
        'description',
        'branch_id',
        'fuel_id',
        'user_',
        'user_d',
        'active',
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
        'active' => 'Yes',
    ];

    //change this

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class,'product_id');
    }

    public function nozzles(): HasMany
    {
        return $this->hasMany(Nozzle::class,'tank_id');
    }

    public function dips(): HasMany
    {
        return $this->hasMany(Dip::class,'parent_id');
    }

    public function meters(): HasManyThrough
    {
        return $this->hasManyThrough(Meter::class,Nozzle::class,'tank_id','parent_id');
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class,'branch_id');
    }
}
