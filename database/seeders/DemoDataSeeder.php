<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Shipment;
use App\Models\ShipmentItem;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        // Seed reference products first
        $this->call(ProductSeeder::class);

        $products = Product::all();

        Shipment::factory()
            ->has(
                ShipmentItem::factory()
                    ->count(3)
                    ->recycle($products),   // reuse seeded products for product_id
                'items'
            )
            ->count(10)
            ->create();
    }
}
