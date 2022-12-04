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
class ProductType extends Model
{
    use HasFactory;

  /**
   * The attributes that are mass assignable.
   *
   * @var array
   */
  protected $fillable = [
      'type',
      'created_at',
      'updated_at',
      'user_',
      'user_d'
  ];

  public function products(): HasMany
  {
      return $this->hasMany(Product::class,'type');
  }

}
