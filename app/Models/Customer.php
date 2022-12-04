<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @method static create(array $array)
 * @method static find(string $id)
 */
class Customer extends Model
{
    use HasFactory;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'short',
        'active',
        'user_',
        'user_d',
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

    public function debt(): HasMany
    {
        return $this->hasMany(Debt::class,'parent_id');
    }

    public function prepaid(): HasMany
    {
        return $this->hasMany(Prepaid::class,'parent_id');
    }

    public function branches(): BelongsToMany
    {
        return $this->belongsToMany(Branch::class,'branch_customers','customer_id','branch_id')->using(BranchCustomer::class);
    }
}
