<?php

namespace App\Http\Controllers;

use App\Models\Shipment;
use App\Models\Transaction;
use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use Illuminate\Support\Arr;

class TransactionController extends Controller
{
    // POST /shipments/{shipment}/transactions
    public function store(StoreTransactionRequest $request, Shipment $shipment)
    {
        $data = $request->validated();

        // Create the transaction under this shipment (no trusting a posted shipment_id)
        $tx = $shipment->transactions()->create(Arr::except($data, ['lines']));

        // (optional) create lines if included; your TransactionLine events will mirror to ShipmentItem
        if (!empty($data['lines']) && is_array($data['lines'])) {
            foreach ($data['lines'] as $line) {
                $tx->lines()->create($line);
            }
        }

        return redirect()
            ->route('shipments.show', $shipment)
            ->with('status', 'Transaction added');
    }

    // If you want editing from the same shipment page:
    public function update(UpdateTransactionRequest $request, Transaction $transaction)
    {
        $transaction->update($request->validated());

        return redirect()
            ->route('shipments.show', $transaction->shipment_id)
            ->with('status', 'Transaction updated');
    }

    public function destroy(Transaction $transaction)
    {
        $shipmentId = $transaction->shipment_id;
        $transaction->delete();

        return redirect()
            ->route('shipments.show', $shipmentId)
            ->with('status', 'Transaction deleted');
    }
}
