<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @method static create(array $array)
 * @method static find(string $id)
 */
class Nozzle extends Model
{

    public $timestamps = true;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        //'id',
        'tank_id',
        'name',
        'pump_id',
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

    public function tank(): BelongsTo
    {
        return $this->belongsTo(Tank::class,'tank_id');
    }

    public function pump(): BelongsTo
    {
        return $this->belongsTo(Pump::class,'pump_id');
    }

    public function meters(): HasMany
    {
        return $this->hasMany(Meter::class,'parent_id');
    }
}
