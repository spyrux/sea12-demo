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
                ShipmentItem::factory()
                    ->count(3)
                    ->recycle($products),   
                'items'
            )
            ->count(10)
            ->create();
        Transaction::factory()
            ->count(12)
            ->create();
    }
}
