<?php

namespace Database\Factories;

use App\Enums\ShipmentStatus;
use App\Models\Location;
use App\Models\Shipment;
use App\Models\ShipmentVersion;
use App\Models\Vessel;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Shipment>
 */
class ShipmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // Shipment model only stores latest_version_id
            // All other data goes in ShipmentVersion
        ];
    }

    /**
     * Configure the model factory.
     */
    public function configure()
    {
        return $this->afterCreating(function (Shipment $shipment) {
            // Create initial version if none exists
            if (!$shipment->latestVersion) {
                $vessel = Vessel::factory()->create();
                $origin = Location::factory()->create();
                $destination = Location::factory()->create();

                $version = ShipmentVersion::create([
                    'shipment_id' => $shipment->id,
                    'version' => 1,
                    'status' => ShipmentStatus::PLANNED,
                    'cargo_sailing_date' => Carbon::now()->toDateString(),
                    'eta' => Carbon::parse(
                        $this->faker->dateTimeBetween('+1 week', '+1 month')
                    )->toDateString(),
                    'vessel_id' => $vessel->id,
                    'origin_id' => $origin->id,
                    'destination_id' => $destination->id,
                    'actor_id' => null,
                    'reason' => 'Initial creation'
                ]);

                $shipment->update(['latest_version_id' => $version->id]);
            }
        });
    }

    // Handy states (optional)
    public function inTransit(): static
    {
        return $this->afterCreating(function (Shipment $shipment) {
            $shipment->writeVersion(['status' => ShipmentStatus::IN_TRANSIT], null, 'Status updated to in transit');
        });
    }

    public function arrived(): static
    {
        return $this->afterCreating(function (Shipment $shipment) {
            $shipment->writeVersion(['status' => ShipmentStatus::ARRIVED], null, 'Status updated to arrived');
        });
    }

    public function closed(): static
    {
        return $this->afterCreating(function (Shipment $shipment) {
            $shipment->writeVersion(['status' => ShipmentStatus::CLOSED], null, 'Status updated to closed');
        });
    }
}