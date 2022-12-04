<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Receivable extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'amount',
        'parent_id',
        'description',

        'branch_id',
        'user_shift_date',
        'user_',
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
        'amount',
        'parent_id',
        'description',
        'branch_id',
        'user_',
        'readonly',
        'branch_int_date',
        'record_date',
        'unique_int',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    protected string $main_table = "main_receivables";

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

    public function receivabletype(): BelongsTo
    {
        return $this->belongsTo(ReceivableType::class,'parent_id');
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class,'branch_id');
    }
}
