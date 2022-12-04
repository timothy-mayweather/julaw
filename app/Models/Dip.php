<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @method static select(string[] $array)
 */
class Dip extends Model
{

    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        //'id',
        'user_',
        'user_d',
        'tank_id',
        'opening',
        'closing',
        'readonly',
        'branch_id',
        'record_date',
        'branch_int_date',
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
        'readonly' => 0,
    ];

    /** get user, the owner */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class,'user_id');
    }

    public function tank(): BelongsTo
    {
        return $this->belongsTo(Tank::class,'tank_id');
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class,'branch_id');
    }
}
