<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;

class ShipmentItem extends Model
{
    use HasFactory, HasUlids;

    // ULID primary key
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'shipment_id',
        'transaction_line_id',
        'name',
        'quantity',
    ];

    protected $casts = [
        'shipment_id'         => 'string',
        'transaction_line_id' => 'string',
        'name'                => 'string',
        'quantity'            => 'decimal:2',
    ];

    // Relationships
    public function shipment()
    {
        return $this->belongsTo(Shipment::class);
    }

    public function transactionLine()
    {
        return $this->belongsTo(TransactionLine::class, 'transaction_line_id');
    }

    /**
     * Sensible defaults & guards:
     * - If name not provided, copy from TransactionLine->name (when available)
     * - Ensure quantity is positive; default to TransactionLine->quantity if not provided
     */
    protected static function booted(): void
    {
        static::creating(function (self $item) {
            // Backfill name from the linked transaction line
            if (empty($item->name) && $item->transaction_line_id) {
                $line = $item->transactionLine()->first();
                if ($line && !empty($line->name)) {
                    $item->name = $line->name;
                }
            }

            // Backfill quantity if missing (use TL quantity if present)
            if (is_null($item->quantity) && $item->transaction_line_id) {
                $line = $item->transactionLine()->first();
                if ($line && !is_null($line->quantity)) {
                    $item->quantity = $line->quantity;
                }
            }

            // Guard: quantity must be > 0
            if ((float)$item->quantity <= 0) {
                throw new \InvalidArgumentException('Shipment item quantity must be greater than zero.');
            }
        });

        static::updating(function (self $item) {
            if ($item->isDirty('quantity') && (float)$item->quantity <= 0) {
                throw new \InvalidArgumentException('Shipment item quantity must be greater than zero.');
            }
        });
    }
}
