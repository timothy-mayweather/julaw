<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Summary extends Model
{
    use HasFactory;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'price_adjustment',
        'banked',
        'shortage',
        'cash',
        'shift',
        'branch_id',
        'readonly',
        'active',
        'created_at',
        'updated_at',
    ];
    
    /**
     * The attributes that have default values
     *
     * @var array
     */
    protected $attributes = [
        'active' => 'Yes',
    ];
    
    /** get user, the owner */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class,'user_id');
    }
    
    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class,'branch_id');
    }
}
