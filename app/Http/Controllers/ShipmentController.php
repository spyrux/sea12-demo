<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Shipment;
use App\Http\Requests\StoreShipmentRequest;
use App\Http\Requests\UpdateShipmentRequest;

class ShipmentController extends Controller
{
    /** List shipments (use latestVersion for display) */
    public function index()
    {
        $shipments = Shipment::with('latestVersion')
            ->latest()
            ->paginate(10)
            ->through(function (Shipment $s) {
                return [
                    'id'   => $s->id,
                    'status' => $s->status, // accessor proxies to latestVersion
                    'cargo_sailing_date' => optional($s->cargo_sailing_date)?->toDateString(),
                    'eta'   => optional($s->eta)?->toDateString(),
                ];
            });

        return Inertia::render('Shipments/Index', [
            'shipments' => $shipments,
        ]);
    }

    /** Create page */
    public function create()
    {
        return Inertia::render('Shipments/Create', [
            'statuses' => ['PLANNED','IN_TRANSIT','ARRIVED','CLOSED'],
        ]);
    }

    /** Create shipment + first version */
    public function store(StoreShipmentRequest $request)
    {
        $shipment = Shipment::create(); // bare row (ULID via HasUlids)

        $shipment->writeVersion(
            $request->validated(),
            actorId: $request->user()?->id,
            reason: 'created'
        );

        return redirect()
            ->route('shipments.show', $shipment)
            ->with('status', 'Shipment created');
    }

    /** Show one (latest + history) */
    public function show(Shipment $shipment)
    {
        $shipment->load([
            'latestVersion',
            'versions' => fn ($q) => $q->orderByDesc('version'),
        ]);

        return Inertia::render('Shipments/Show', [
            'shipment' => [
                'id'   => $shipment->id,
                'latest' => [
                    'status' => $shipment->status,
                    'cargo_sailing_date' => optional($shipment->cargo_sailing_date)?->toDateString(),
                    'eta' => optional($shipment->eta)?->toDateString(),
                    'vessel_id' => $shipment->vessel_id,
                    'origin_id' => $shipment->origin_id,
                    'destination_id' => $shipment->destination_id,
                ],
                'versions' => $shipment->versions->map(fn ($v) => [
                    'id' => $v->id,
                    'version' => $v->version,
                    'status' => $v->status,
                    'cargo_sailing_date' => optional($v->cargo_sailing_date)?->toDateString(),
                    'eta' => optional($v->eta)?->toDateString(),
                    'created_at' => $v->created_at->toDateTimeString(),
                    'actor_id' => $v->actor_id,
                    'reason' => $v->reason ?? null,
                ]),
            ],
        ]);
    }

    /** Edit page (pre-fill with latest) */
    public function edit(Shipment $shipment)
    {
        $shipment->load('latestVersion');

        return Inertia::render('Shipments/Edit', [
            'shipment' => [
                'id' => $shipment->id,
                'status' => $shipment->status,
                'cargo_sailing_date' => optional($shipment->cargo_sailing_date)?->toDateString(),
                'eta' => optional($shipment->eta)?->toDateString(),
                'vessel_id' => $shipment->vessel_id,
                'origin_id' => $shipment->origin_id,
                'destination_id' => $shipment->destination_id,
            ],
            'statuses' => ['PLANNED','IN_TRANSIT','ARRIVED','CLOSED'],
        ]);
    }

    /** Append a new version */
    public function update(UpdateShipmentRequest $request, Shipment $shipment)
    {
        $shipment->writeVersion(
            $request->validated(),
            actorId: $request->user()?->id,
            reason: 'updated'
        );

        return redirect()
            ->route('shipments.show', $shipment)
            ->with('status', 'Shipment updated');
    }

    /** Delete shipment (versions cascade) */
    public function destroy(Shipment $shipment)
    {
        $shipment->delete();

        return redirect()
            ->route('shipments.index')
            ->with('status', 'Shipment deleted');
    }
}
