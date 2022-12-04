<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ExpenseType extends Model
{
    use HasFactory;

    protected $fillable = [
        'description',
        'name',
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

    public function expenses(): HasMany
    {
        return $this->hasMany(Expense::class,'parent_id');
    }

    public function branches(): BelongsToMany
    {
        return $this->belongsToMany(Branch::class,'branch_expense_types','exp_id','branch_id')->using(BranchExpenseType::class);
    }
}
