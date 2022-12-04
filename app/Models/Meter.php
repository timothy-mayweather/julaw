<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Meter extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected array $main_fillable = [
        'user_',
        'nozzle_id',
        'opening',
        'closing',
        'rtt',
        'price',
        'branch_id',
        'readonly',
        'branch_int_date',
        'record_date',
        'unique_int',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    protected string $main_table = "main_meters";

    public function change_table(): void
    {
        $this->table = $this->main_table;
        $this->fillable = $this->main_fillable;
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_shift_date',
        'user_id',
        'user_',
        'nozzle_id',
        'opening',
        'closing',
        'rtt',
        'price',
        'shift',
        'branch_id',
        'readonly',
        'branch_int_date',
        'record_date',
        'unique_int',
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
        'rtt' => 0,
        'readonly' => 0,
    ];

    /** get user, the owner */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class,'user_id');
    }

    public function nozzle(): BelongsTo
    {
        return $this->belongsTo(Nozzle::class,'nozzle_id');
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class,'branch_id');
    }
}
