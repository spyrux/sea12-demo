<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use Inertia\Inertia;

class ContractController extends Controller
{
    public function index()
    {
        // eager load transaction + shipment
        $contracts = Contract::with(['transaction.shipment'])
            ->latest()
            ->get();

        // group contracts by shipment_id
        $grouped = $contracts->groupBy(fn ($c) => $c->transaction?->shipment_id);

        return Inertia::render('Contracts/index', [
            'contractsByShipment' => $grouped->map(function ($contracts) {
                $shipment = $contracts->first()->transaction->shipment;

                return [
                    'shipment'  => [
                        'id'   => $shipment->id,
                        'name' => $shipment->name ?? "Shipment #{$shipment->id}",
                    ],
                    'contracts' => $contracts->map(function ($c) {
                        return [
                            'id'         => $c->id,
                            'transaction'=> [
                                'id'        => $c->transaction->id,
                                'reference' => $c->transaction->reference,
                            ],
                        ];
                    })->values(),
                ];
            })->values(),
        ]);
    }
}
