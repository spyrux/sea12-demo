<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUlids;

class Contract extends Model
{
    use HasFactory, HasUlids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'blob_id',
        'transaction_id',
    ];

    // Relationships
    public function transactions() {
        return $this->hasMany(Transaction::class);
    }

    public function shipment()
    {
        return $this->hasOneThrough(
            Shipment::class,    // final
            Transaction::class, // through
            'id',               // Transaction.id (local key on through)
            'id',               // Shipment.id (local key on final)
            'transaction_id',   // Contract.transaction_id (FK on this model -> Transaction.id)
            'shipment_id'       // Transaction.shipment_id (FK on through -> Shipment.id)
        );
    }
}