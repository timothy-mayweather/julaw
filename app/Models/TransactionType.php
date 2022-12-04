<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TransactionType extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'description',
        'active',
        'user_',
        'user_d',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    /**
     * The attributes that have default values
     *
     * @var array
     */
    protected $attributes = [
        'active' => 'Yes',
    ];

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class,'parent_id');
    }

    public function branches(): BelongsToMany
    {
        return $this->belongsToMany(Branch::class,'branch_transaction_types','tr_id','branch_id')->using(BranchTransactionType::class);
    }
}
