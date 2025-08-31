<?php
namespace App\Observers;

use App\Models\ShipmentVersion;

class ShipmentObserver
{
    public function created(ShipmentVersion $version): void
    {
        $s = $version->shipment;
        if ($s && $s->latest_version_id !== $version->id) {
            $s->forceFill(['latest_version_id' => $version->id])->save();
        }
    }

    public function deleted(ShipmentVersion $version): void
    {
        $s = $version->shipment;
        if ($s && $s->latest_version_id === $version->id) {
            $s->pointToLatest(); // repoint to next-latest if any
        }
    }
}
