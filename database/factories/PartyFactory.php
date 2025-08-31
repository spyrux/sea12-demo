<?php

namespace Database\Factories;

use App\Models\Party;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Party>
 */
class PartyFactory extends Factory
{
    protected $model = Party::class;

    public function definition(): array
    {
        // default: make a company
        return [
            'name' => fake()->company(),
            'type' => 'COMPANY', // or 'INDIVIDUAL' (use states below)
        ];
    }

    /** Make an individual party */
    public function individual(): static
    {
        return $this->state(fn () => [
            'name' => fake()->name(),
            'type' => 'INDIVIDUAL',
        ]);
    }

    /** Make a company party */
    public function company(): static
    {
        return $this->state(fn () => [
            'name' => fake()->company(),
            'type' => 'COMPANY',
        ]);
    }
}
