<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @method static create(array $array)
 * @method static orderBy(string $string)
 * @method static find(int $id)
 * @method static firstWhere(string $string, string $type)
 * @method static where(string $string, string $type)
 * @method static select(string[] $array)
 */
class EmployeeRole extends Model
{
    use HasFactory;

  /**
   * The attributes that are mass assignable.
   *
   * @var array
   */
  protected $fillable = [
      'role',
      'created_at',
      'updated_at',
      'user_',
      'user_d',
      'provisional'
  ];

  public function employees(): HasMany
  {
      return $this->hasMany(Employee::class,'role');
  }

}
