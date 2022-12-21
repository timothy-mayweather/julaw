<?php

namespace App\Models\Registry;

use Illuminate\Database\Eloquent\Model;

/**
 * @method static create(array $array)
 * @method static where(string $string, int $branch_id)
 * @method static find(int $id)
 * @method static select(string $string)
 */
class Supplier extends Model
{
    public $timestamps = true;
    public $incrementing = true;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'location',
        'description',
        'phone',
        'email',
        'user_',
        'user_d',
        'active',
        'created_at',
        'updated_at',
        'deleted_at',
        'provisional'
    ];

    /**
     * The attributes that have default values
     *
     * @var array
     */
    protected $attributes = [
        'active' => 'Yes',
    ];
}
