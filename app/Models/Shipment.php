<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use App\Models\ShipmentVersion;

class Shipment extends Model
{
    use HasFactory, HasUlids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'latest_version_id',
    ];

    protected $casts = [
        'latest_version_id' => 'string',
    ];

    // Relationships
    public function latestVersion() { return $this->belongsTo(ShipmentVersion::class, 'latest_version_id'); }
    public function transactions() { return $this->hasMany(Transaction::class); } // ← key one
    public function pointToLatest(): void
    {
        $latest = $this->versions()->orderByDesc('version')->first();
        if ($latest && $this->latest_version_id !== $latest->id) {
            $this->forceFill(['latest_version_id' => $latest->id])->save();
        }
    }
    public function writeVersion(?string $actorId = null, ?string $reason = null): void
{
    // eager-load items for the snapshot (adjust relations as needed)
    $payload = $this->fresh(['transactions'])->toArray();

    $next = (int) ($this->versions()->max('version') ?? 0) + 1;

    ShipmentVersion::create([
        'shipment_id'   => $this->id,
        'version'       => $next,
        'snapshot_json' => json_encode($payload, JSON_UNESCAPED_UNICODE),
        'actor_id'      => $actorId,
        'reason'        => $reason,
    ]);
}
}
