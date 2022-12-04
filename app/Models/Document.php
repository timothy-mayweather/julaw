<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @method static create(array $array)
 * @method static orderBy(string $string)
 * @method static addSelect(array $array)
 * @method static find(int $id)
 * @method static where(string $string, $id)
 * @method static select(string $string)
 */
class Document extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        //'id',
        'user_',
        'user_d',
        'name',
        'path',
        'record_date',
        'description',
        'branch_id',
        'created_at',
        'updated_at',
        'branch_int_date'
    ];

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class,'branch_id');
    }
}
