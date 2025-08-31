<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
// use App\Enums\TransactionType; // <- if you use a PHP enum

class Transaction extends Model
{
    use HasFactory, HasUlids;

    public $incrementing = false;   // ULID PK
    protected $keyType = 'string';

    protected $fillable = [
        'type',        // e.g. PURCHASE, SALE, FREIGHT...
        'tx_date',     // YYYY-MM-DD
        'external_id', // optional client/system ref
        'total_value', // sum of lines
    ];

    protected $casts = [
        'tx_date'     => 'date',
        'total_value' => 'decimal:2',
        // 'type'      => TransactionType::class, // uncomment if using enum
    ];

    /* ---------------- Relationships ---------------- */

    // Transaction has many lines (product, qty, unit_price, line_value)
    public function lines()
    {
        return $this->hasMany(TransactionLine::class);
    }

    // Transaction ↔ Parties with a role on the pivot (BUYER/SELLER/CARRIER/...)
    public function parties()
    {
        return $this->belongsToMany(Party::class, 'transaction_parties')
                    ->withPivot(['id', 'role'])
                    ->withTimestamps();
    }

    /* ---------------- Helpers (optional) ---------------- */

    // Recalculate total_value from lines (call after modifying lines)
    public function recalcTotal(): void
    {
        $sum = $this->lines()->sum('line_value');
        $this->forceFill(['total_value' => $sum])->save();
    }
}
