<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUlids;

class Location extends Model
{
    use HasFactory, HasUlids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
    ];

    /**
     * Relationships
     */
    public function originShipments()
    {
        return $this->hasMany(Shipment::class, 'origin_id');
    }

    public function destinationShipments()
    {
        return $this->hasMany(Shipment::class, 'destination_id');
    }
}
