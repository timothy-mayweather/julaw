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
class Product extends Model
{
    use HasFactory;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_',
        'user_d',
        'short_name',
        'name',
        'type',
        'description',
        'active',
        'created_at',
        'updated_at',
    ];

    /**
     * The attributes that have default values
     *
     * @var array
     */
    protected $attributes = [
        'active' => 'Yes',
    ];

    public function productsales(): HasMany
    {
        return $this->hasMany(ProductSale::class,'parent_id');
    }

    public function tanks(): HasMany
    {
        return $this->hasMany(Tank::class,'product_id');
    }

    public function nozzles(): HasManyThrough
    {
        return $this->hasManyThrough(Nozzle::class,Tank::class,'product_id','tank_id');
    }

    public function dips(): HasManyThrough
    {
        return $this->hasManyThrough(Dip::class,Tank::class,'product_id','parent_id');
    }

    public function inventory(): HasMany
    {
        return $this->hasMany(Inventory::class,'parent_id');
    }

    public function branches(): BelongsToMany
    {
        return $this->belongsToMany(Branch::class,'branch_products','product_id','branch_id')->using(BranchProduct::class);
    }
}
