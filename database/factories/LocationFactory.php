<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class LocationFactory extends Factory {
    protected $model = \App\Models\Location::class;
    public function definition(): array {
        return [
            'name' => fake()->city(),
        ];
    }
}