<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;

class TransactionLine extends Model
{
    use HasFactory, HasUlids;

    // ULID primary key
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'transaction_id',
        'product_id',
        'quantity',
        'unit_price',
        'line_value',
        'line_number',   // optional ordering per transaction
    ];

    protected $casts = [
        'quantity'   => 'decimal:2',
        'unit_price' => 'decimal:2',
        'line_value' => 'decimal:2',
    ];

    /* ---------------- Relationships ---------------- */

    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /* ---------------- Helpers / Automations ---------------- */

    // Keep line_value in sync; auto-assign line_number if missing
    protected static function booted(): void
    {
        static::creating(function (self $line) {
            // auto line_number if not provided and we know the parent
            if (is_null($line->line_number) && $line->transaction_id) {
                $max = self::where('transaction_id', $line->transaction_id)->max('line_number');
                $line->line_number = (int)($max ?? 0) + 1;
            }

            // compute line_value if not set
            if (is_null($line->line_value)) {
                $line->line_value = round((float)$line->quantity * (float)$line->unit_price, 2);
            }
        });

        static::updating(function (self $line) {
            // if qty or price changed, refresh line_value
            if ($line->isDirty(['quantity', 'unit_price'])) {
                $line->line_value = round((float)$line->quantity * (float)$line->unit_price, 2);
            }
        });
    }
}
