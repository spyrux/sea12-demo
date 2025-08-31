<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class VesselFactory extends Factory {
    protected $model = \App\Models\Vessel::class;
    public function definition(): array {
        return [
            'name' => fake()->company().' Lines',
        ];
    }
}