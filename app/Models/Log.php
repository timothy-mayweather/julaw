<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Log extends Model
{
    use HasFactory;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'logged_out',
        'timed_out',
        'inserts',
        'updates',
        'deletes',
        'user_id',
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
        'logged_out' => false,
        'timed_out' => false,
        'inserts' => 0,
        'updates' => 0,
        'deletes' => 0,
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
