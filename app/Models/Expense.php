<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Expense extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'description',
        'amount',

        'branch_id',
        'user_shift_date',
        'user_',
        'parent_id',
        'shift',
        'readonly',
        'branch_int_date',
        'record_date',
        'unique_int',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected array $main_fillable = [
        'description',
        'amount',
        'branch_id',
        'user_',
        'parent_id',
        'readonly',
        'branch_int_date',
        'record_date',
        'unique_int',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    protected string $main_table = "main_expenses";

    public function change_table(): void
    {
        $this->table = $this->main_table;
        $this->fillable = $this->main_fillable;
    }

    /**
     * The attributes that have default values
     *
     * @var array
     */
    protected $attributes = [
        'readonly' => 0,
    ];

    /** get user, the owner */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class,'user_id');
    }

    public function expensetype(): BelongsTo
    {
        return $this->belongsTo(ExpenseType::class,'parent_id');
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class,'branch_id');
    }
}
