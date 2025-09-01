<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Shipment;
use App\Models\Transaction;
use App\Models\Location;
use App\Models\Vessel;
use App\Models\Party;
use App\Enums\ShipmentStatus;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        // Create some locations / vessels / parties
        $locations = Location::factory()->count(5)->create();
        $vessels   = Vessel::factory()->count(3)->create();
        $parties   = Party::factory()->count(8)->create();

        // Create shipments with different statuses
        $statuses = [
            ShipmentStatus::PLANNED,
            ShipmentStatus::IN_TRANSIT,
            ShipmentStatus::ARRIVED,
            ShipmentStatus::CLOSED,
            ShipmentStatus::PLANNED,
        ];

        foreach ($statuses as $status) {
            $shipment = Shipment::factory()->create();

            // Update the status through the versioning system
            if ($status !== ShipmentStatus::PLANNED) {
                $shipment->writeVersion(['status' => $status], null, 'Status updated');
            }

            // Add transactions (with lines + parties) to each shipment
            Transaction::factory()
                ->count(rand(1, 3))
                ->create(['shipment_id' => $shipment->id])
                ->each(function (Transaction $transaction) use ($parties) {
                    // ---- Create transaction lines ----
                    $lineCount = rand(2, 5);
                    for ($i = 1; $i <= $lineCount; $i++) {
                        $transaction->lines()->create([
                            'name'       => fake()->words(3, true),
                            'quantity'   => fake()->numberBetween(1, 50),   // decimal(?,2)
                            'unit_price' => fake()->randomFloat(2, 5, 200),  // decimal(?,2)
                            // line_value & line_number handled in TransactionLine model events
                        ]);
                        // NOTE: Your TransactionLine::created hook will auto-create ShipmentItem here.
                    }

                    // ---- Attach random parties to the transaction ----
                    $selectedParties = $parties->random(rand(2, 4));
                    $roles = ['BUYER', 'SELLER', 'CARRIER'];

                    foreach ($selectedParties as $party) {
                        DB::table('transaction_parties')->insert([
                            'id'             => Str::ulid(),
                            'transaction_id' => $transaction->id,
                            'party_id'       => $party->id,
                            'role'           => $roles[array_rand($roles)],
                            'created_at'     => now(),
                            'updated_at'     => now(),
                        ]);
                    }
                });
        }
    }
}
