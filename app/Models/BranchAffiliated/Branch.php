<?php

namespace App\Models\BranchAffiliated;

use App\Models\Log;
use App\Models\Records\Debt;
use App\Models\Records\Dip;
use App\Models\Records\Expense;
use App\Models\Records\Inventory;
use App\Models\Records\Meter;
use App\Models\Records\Prepaid;
use App\Models\Records\ProductSale;
use App\Models\Records\Receivable;
use App\Models\Records\Summary;
use App\Models\Records\Transaction;
use App\Models\Registry\Customer;
use App\Models\Registry\ExpenseType;
use App\Models\Registry\Product;
use App\Models\Registry\Pump;
use App\Models\Registry\ReceivableType;
use App\Models\Registry\Tank;
use App\Models\Registry\TransactionType;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Notifications\Notifiable;

/**
 * @method static where(string $string, int $int)
 */

/**
 * @method static create(array $array)
 * @method static select(string $string, string $string1)
 */

class Branch extends Model
{
    use HasFactory, Notifiable;

    public $incrementing = true;
    public $timestamps = true;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'user_',
        'user_d',
        'location',
        'created_at',
        'updated_at',
        'deleted_at'
    ];


    public function customers(): BelongsToMany
    {
        return $this->belongsToMany(Customer::class,'branch_customers','branch_id','customer_id')->using(BranchCustomer::class);
    }

    public function expensetypes(): BelongsToMany
    {
        return $this->belongsToMany(ExpenseType::class,'branch_expense_types','branch_id','exp_id')->using(BranchExpenseType::class);
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class,'branch_products','branch_id','product_id')->using(BranchProduct::class);
    }

    public function pumps(): HasMany
    {
        return $this->hasMany(Pump::class,'branch_id');
    }

    public function receivabletypes(): BelongsToMany
    {
        return $this->belongsToMany(ReceivableType::class,'branch_receivable_types','branch_id','recv_id')->using(BranchReceivableType::class);
    }

    public function tanks(): HasMany
    {
        return $this->hasMany(Tank::class,'branch_id');
    }

    public function transactiontypes(): BelongsToMany
    {
        return $this->belongsToMany(TransactionType::class,'branch_transaction_types','branch_id','tr_id')->using(BranchTransactionType::class);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class,'branch_users','branch_id','user_id')->using(User::class);
    }

    public function debt(): HasMany
    {
        return $this->hasMany(Debt::class,'branch_id');
    }

    public function dips(): HasMany
    {
        return $this->hasMany(Dip::class,'branch_id');
    }

    public function expenses(): HasMany
    {
        return $this->hasMany(Expense::class,'branch_id');
    }

    public function inventories(): HasMany
    {
        return $this->hasMany(Inventory::class,'branch_id');
    }

    public function logs(): HasMany
    {
        return $this->hasMany(Log::class,'branch_id');
    }

    public function meters(): HasMany
    {
        return $this->hasMany(Meter::class,'branch_id');
    }

    public function prepaid(): HasMany
    {
        return $this->hasMany(Prepaid::class,'branch_id');
    }

    public function productsales(): HasMany
    {
        return $this->hasMany(ProductSale::class,'branch_id');
    }

    public function receivables(): HasMany
    {
        return $this->hasMany(Receivable::class,'branch_id');
    }

    public function summaries(): HasMany
    {
        return $this->hasMany(Summary::class,'branch_id');
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class,'branch_id');
    }
}
