<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Enums\ShipmentStatus;

class Shipment extends Model
{
    /** @use HasFactory<\Database\Factories\ShipmentFactory> */
    use HasFactory;

    public $incrementing = false;   // because UUID, not auto-increment
    protected $keyType = 'string';  // UUID type
    
    protected $fillable = [
        'id', 'vessel_id', 'origin_id', 'destination_id',
        'cargo_sailing_date', 'eta', 'ship_name', 'status'
    ];

    protected $casts = [
        'cargo_sailing_date' => 'date',
        'eta' => 'date',
        'status' => ShipmentStatus::class,
    ];

    // // relationships
    // public function items() {
    //     return $this->hasMany(ShipmentItem::class);
    // }
    // public function vessel() {
    //     return $this->belongsTo(Vessel::class);
    // }
}
