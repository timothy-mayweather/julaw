<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Sanctum\HasApiTokens;

/**
 * @method static create(array $array)
 * @method static find($id)
 * @property string id
 */
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'phone',
        'email',
        'active',
        'manager',
        'password',
        'user_',
        'user_d',
        'branch_id',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * The attributes that have default values
     *
     * @var array
     */
    protected $attributes = [
        'active' => 'Yes',
        'manager' => 'No',
    ];

    public function debt(): HasMany
    {
        return $this->hasMany(Debt::class,'user_');
    }

    public function dips(): HasMany
    {
        return $this->hasMany(Dip::class,'user_');
    }

    public function expenses(): HasMany
    {
        return $this->hasMany(Expense::class,'user_');
    }

    public function inventories(): HasMany
    {
        return $this->hasMany(Inventory::class,'user_');
    }

    public function logs(): HasMany
    {
        return $this->hasMany(Log::class,'user_');
    }

    public function meters(): HasMany
    {
        return $this->hasMany(Meter::class,'user_');
    }

    public function prepaid(): HasMany
    {
        return $this->hasMany(Prepaid::class,'user_');
    }

    public function productsales(): HasMany
    {
        return $this->hasMany(ProductSale::class,'user_');
    }

    public function receivables(): HasMany
    {
        return $this->hasMany(Receivable::class,'user_');
    }

    public function summaries(): HasMany
    {
        return $this->hasMany(Summary::class,'user_');
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class,'user_');
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class,'branch_id');
    }
}
