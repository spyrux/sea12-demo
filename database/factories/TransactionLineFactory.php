<?php

namespace Database\Factories;

use App\Models\TransactionLine;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class TransactionLineFactory extends Factory
{
    protected $model = TransactionLine::class;

    public function definition(): array
    {
        $qty   = $this->faker->randomFloat(2, 1, 50);
        $price = 1.00; // keep simple

        return [
            'name'        => $this->faker->words(2, true), // e.g., "Steel Beams"
            'quantity'    => $qty,
            'unit_price'  => $price,
            'line_value'  => round($qty * $price, 2),
            'line_number' => null,
        ];
    }

    public function oneDollar(): static
    {
        return $this->state(function (array $attrs) {
            $q = $attrs['quantity'] ?? 1;
            return ['unit_price' => 1.00, 'line_value' => round($q * 1.00, 2)];
        });
    }

    public function randomPrice(float $min = 1, float $max = 500): static
    {
        return $this->state(function (array $attrs) use ($min, $max) {
            $p = round($this->faker->randomFloat(2, $min, $max), 2);
            $q = $attrs['quantity'] ?? 1;
            return ['unit_price' => $p, 'line_value' => round($q * $p, 2)];
        });
    }
}

