<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Support\Facades\DB;

class Shipment extends Model
{
    use HasFactory, HasUlids;

    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * Shipments table only stores a pointer to the latest version.
     */
    protected $fillable = [
        'latest_version_id',
    ];

    protected $casts = [
        'latest_version_id' => 'string',
    ];

    // All versions for this shipment
    public function versions()
    {
        return $this->hasMany(ShipmentVersion::class);
    }

    // Pointer to the most-recent version
    public function latestVersion()
    {
        return $this->belongsTo(ShipmentVersion::class, 'latest_version_id');
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function writeVersion(array $attrs, ?string $actorId = null, ?string $reason = null): void
    {
        DB::transaction(function () use ($attrs, $actorId, $reason) {
            // Lock-free in SQLite, but transaction still prevents interleaving
            $current = (int) ($this->versions()->max('version') ?? 0);
            $next    = $current + 1;

            // Get the latest row again to copy forward defaults
            $latest = $this->versions()
                ->orderByDesc('version')
                ->first();

            $payload = [
                'shipment_id'     => $this->id,
                'version'         => $next,
                'status'          => $attrs['status'] ?? $latest?->status ?? ShipmentStatus::PLANNED,
                'cargo_sailing_date' => $attrs['cargo_sailing_date'] ?? $latest?->cargo_sailing_date,
                'eta'             => $attrs['eta'] ?? $latest?->eta,
                'vessel_id'       => $attrs['vessel_id'] ?? $latest?->vessel_id,
                'origin_id'       => $attrs['origin_id'] ?? $latest?->origin_id,
                'destination_id'  => $attrs['destination_id'] ?? $latest?->destination_id,
                'actor_id'        => $actorId,
                'reason'          => $reason,
            ];

            $version = ShipmentVersion::create($payload);

            // Update pointer on the shipment
            $this->forceFill(['latest_version_id' => $version->id])->save();
        });
    }
    public function getStatusAttribute()
    {
        return $this->latestVersion?->status;
    }

    public function getCargoSailingDateAttribute()
    {
        return $this->latestVersion?->cargo_sailing_date;
    }

    public function getEtaAttribute()
    {
        return $this->latestVersion?->eta;
    }

    public function getVesselIdAttribute()
    {
        return $this->latestVersion?->vessel_id;
    }

    public function getOriginIdAttribute()
    {
        return $this->latestVersion?->origin_id;
    }

    public function getDestinationIdAttribute()
    {
        return $this->latestVersion?->destination_id;
    }
}
