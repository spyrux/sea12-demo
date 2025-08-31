<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Shipment;
use App\Models\ShipmentItem;
use App\Models\Transaction;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(ProductSeeder::class);

        $products = Product::all();

        Shipment::factory()
        ->has(
            Transaction::factory()
                ->count(3)
                ->withLinesAndParties(3),
            'transactions'
        )
        ->create();
    }
}
