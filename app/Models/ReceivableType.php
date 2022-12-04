<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ReceivableType extends Model
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

    public function receivables(): HasMany
    {
        return $this->hasMany(Receivable::class,'parent_id');
    }

    public function branches(): BelongsToMany
    {
        return $this->belongsToMany(Branch::class,'branch_receivable_types','recv_id','branch_id')->using(BranchReceivableType::class);
    }
}
