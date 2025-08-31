<?php

namespace Database\Factories;

use App\Enums\ShipmentStatus;
use App\Models\Location;
use App\Models\Shipment;
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
            'vessel_id'      => Vessel::factory(),
            'origin_id'      => Location::factory(),
            'destination_id' => Location::factory(),

            'cargo_sailing_date' => Carbon::now()->toDateString(),
            'eta'                => Carbon::parse(
                $this->faker->dateTimeBetween('+1 week', '+1 month')
            )->toDateString(),

            'status' => ShipmentStatus::PLANNED, // or 'PLANNED' if not using enum
        ];
    }

    // Handy states (optional)
    public function inTransit(): static
    {
        return $this->state(fn () => ['status' => ShipmentStatus::IN_TRANSIT]);
    }

    public function arrived(): static
    {
        return $this->state(fn () => ['status' => ShipmentStatus::ARRIVED]);
    }

    public function closed(): static
    {
        return $this->state(fn () => ['status' => ShipmentStatus::CLOSED]);
    }
}