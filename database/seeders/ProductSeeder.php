<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run() {
        $products = [
          ['id'=>Str::ulid(), 'name'=>'Steel Beam', 'sku'=>'STL-BEAM'],
          ['id'=>Str::ulid(), 'name'=>'Aluminum Sheet', 'sku'=>'AL-SHEET'],
          ['id'=>Str::ulid(), 'name'=>'Generator', 'sku'=>'GEN-1000'],
        ];
        DB::table('products')->upsert($products, ['sku']); // idempotent
    }
}
