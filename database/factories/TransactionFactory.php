<?php

namespace Database\Factories;

use App\Models\Transaction;
use App\Models\TransactionLine;
use App\Models\Product;
use App\Models\Party;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class TransactionFactory extends Factory
{
    protected $model = Transaction::class;

    public function definition(): array
    {
        return [
            'type'        => fake()->randomElement(['PURCHASE','SALE','FREIGHT','INSURANCE']),
            'tx_date'     => Carbon::now()->subDays(fake()->numberBetween(0, 30))->toDateString(),
            'external_id' => fake()->optional()->bothify('EXT-#####'),
            'total_value' => 0,
        ];
    }

    public function withLinesAndParties(int $lineCount = 2): static
    {
        return $this->afterCreating(function (Transaction $tx) use ($lineCount) {
            \App\Models\TransactionLine::factory()
                ->count($lineCount)
                ->for($tx) // sets transaction_id
                ->oneDollar()
                ->sequence(fn($s) => ['line_number' => $s->index + 1])
                ->create();
    
            $buyer  = \App\Models\Party::factory()->create();
            $seller = \App\Models\Party::factory()->create();
            $tx->parties()->attach($buyer->id,  ['role' => 'BUYER']);
            $tx->parties()->attach($seller->id, ['role' => 'SELLER']);
    
            $tx->recalcTotal(); // or $tx->forceFill(['total_value' => $tx->lines()->sum('line_value')])->save();
        });
    }
}
