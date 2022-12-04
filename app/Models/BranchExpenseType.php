<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

/**
 * @method static where(string $string, mixed $price)
 */
class BranchExpenseType extends Pivot
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id',
        'branch_id',
        'exp_id',
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

    protected $table = 'branch_expense_types';

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class,'branch_id');
    }

    public function expense_type(): BelongsTo
    {
        return $this->belongsTo(ExpenseType::class,'exp_id');
    }
}
