<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use App\Models\ShipmentItem; // <-- import

class TransactionLine extends Model
{
    use HasFactory, HasUlids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'transaction_id',
        'name',
        'quantity',
        'unit_price',
        'line_value',
        'line_number',
    ];

    protected $casts = [
        'name'       => 'string',
        'quantity'   => 'integer',
        'unit_price' => 'decimal:2',
        'line_value' => 'decimal:2',
    ];

    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }

    protected static function booted(): void
    {
        // ---- your existing calc/ordering logic ----
        static::creating(function (self $line) {
            if (is_null($line->line_number) && $line->transaction_id) {
                $max = self::where('transaction_id', $line->transaction_id)->max('line_number');
                $line->line_number = (int)($max ?? 0) + 1;
            }

            if (is_null($line->line_value)) {
                $line->line_value = round((float)$line->quantity * (float)$line->unit_price, 2);
            }
        });

        static::updating(function (self $line) {
            if ($line->isDirty(['quantity', 'unit_price'])) {
                $line->line_value = round((float)$line->quantity * (float)$line->unit_price, 2);
            }
        });

        // ---- mirror to ShipmentItem ----
        static::created(function (self $line) {
            $shipmentId = optional($line->transaction)->shipment_id;
            if ($shipmentId) {
                ShipmentItem::updateOrCreate(
                    [
                        'shipment_id'         => $shipmentId,
                        'transaction_line_id' => $line->id,
                    ],
                    [
                        'name'     => $line->name,
                        'quantity' => $line->quantity,
                        'unit_price' => $line->unit_price,
                    ]
                );
            }
        });

        static::updated(function (self $line) {
            $shipmentId = optional($line->transaction)->shipment_id;
            if ($shipmentId && $line->wasChanged(['name', 'quantity'])) { // <-- use wasChanged
                ShipmentItem::where([
                    'shipment_id'         => $shipmentId,
                    'transaction_line_id' => $line->id,
                ])->update([
                    'name'     => $line->name,
                    'quantity' => $line->quantity,
                    'unit_price' => $line->unit_price,
                ]);
            }
        });

        static::deleted(function (self $line) {
            $shipmentId = optional($line->transaction)->shipment_id;
            if ($shipmentId) {
                ShipmentItem::where([
                    'shipment_id'         => $shipmentId,
                    'transaction_line_id' => $line->id,
                ])->delete();
            }
        });
    }
}
