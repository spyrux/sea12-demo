<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use App\Enums\TransactionType; // ← ensure this exists

class Transaction extends Model
{
    use HasFactory, HasUlids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'shipment_id',   // FK to shipments
        'type',          // PURCHASE, SALE, FREIGHT...
        'tx_date',       // YYYY-MM-DD
        'external_id',   // optional
        'total_value',   // sum of lines
    ];

    protected $casts = [
        'tx_date'     => 'date',
        'total_value' => 'decimal:2',
        'type'        => TransactionType::class,
    ];

    // Relationships
    public function shipment()     { return $this->belongsTo(Shipment::class); }
    public function lines()        { return $this->hasMany(TransactionLine::class); }
    public function parties()
    {
        return $this->belongsToMany(Party::class, 'transaction_parties')
                    ->withPivot(['id', 'role'])
                    ->withTimestamps();
    }

    // Helpers
    public function recalcTotal(): void
    {
        $this->forceFill(['total_value' => $this->lines()->sum('line_value')])->save();
    }
}
