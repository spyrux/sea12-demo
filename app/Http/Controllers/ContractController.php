<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use App\Models\Blob;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ContractController extends Controller
{
    public function index()
    {
        $transactionsWithContracts = Transaction::with(['shipment', 'contracts'])
            ->whereHas('contracts')
            ->get();

        $transactionsWithoutContracts = Transaction::with('shipment')
            ->whereDoesntHave('contracts')
            ->get();

        $txWith = $transactionsWithContracts->map(fn ($t) => [
            'id'              => $t->id,
            'transaction_date'=> $t->transaction_date,
            'transaction_type'=> $t->transaction_type,
            'total_value'     => $t->total_value,
            'created_at'      => $t->created_at,
            'updated_at'      => $t->updated_at,
            'parties'         => $t->parties->map(fn ($p) => [
                'id'   => $p->id,
                'name' => $p->name,
                'type' => $p->pivot->role ?? null,
            ]),
            'reference'       => $t->reference,
            'shipment_id'     => $t->shipment_id,
            'contract_ids'    => $t->contracts->pluck('id')->values(),
        ])->values();

        $txWithout = $transactionsWithoutContracts->map(fn ($t) => [
            'id'              => $t->id,
            'transaction_date'=> $t->transaction_date,
            'transaction_type'=> $t->transaction_type,
            'total_value'     => $t->total_value,
            'created_at'      => $t->created_at,
            'updated_at'      => $t->updated_at,
            'parties'         => $t->parties->map(fn ($p) => [
                'id'   => $p->id,
                'name' => $p->name,
                'type' => $p->pivot->role ?? null,
            ]),
            'reference'       => $t->reference,
            'shipment_id'     => $t->shipment_id,
        ])->values();

        return Inertia::render('Contracts/index', [
            'transactionsWithContracts'    => $txWith,
            'transactionsWithoutContracts' => $txWithout,
        ]);
    }

    /** Show create form (prefill with ?transaction_id=...) */
    public function create(Request $request)
    {
        $transaction = null;
        if ($request->filled('transaction_id')) {
            $transaction = Transaction::select('id', 'reference', 'shipment_id')
                ->find($request->integer('transaction_id'));
        }

        return Inertia::render('Contracts/Create', [
            'transaction' => $transaction,
        ]);
    }

    /**
     * Store a new contract with a PDF file. Accepts either:
     * - 'pdf' => uploaded file (preferred)
     * - 'pdf_base64' => data URL or raw base64 string of a PDF (for Blob uploads)
     */
    public function store(Request $request)
    {
    $validated = $request->validate([
        'transaction_id' => ['required', 'exists:transactions,id'],
        'pdf'            => ['nullable', 'file', 'mimes:pdf', 'max:20480'], // 20MB
        'pdf_base64'     => ['nullable', 'string'],
        'filename'       => ['nullable', 'string', 'max:255'],
    ]);

    if (!$request->hasFile('pdf') && empty($validated['pdf_base64'])) {
        throw ValidationException::withMessages([
            'pdf' => 'Please attach a PDF file (upload or base64).',
        ]);
    }

    $disk = 'public';
    // Save the PDF to storage
    if ($request->hasFile('pdf')) {
        $file     = $request->file('pdf');
        $path     = $file->store('contracts', $disk);
        $filename = $file->getClientOriginalName();
        $mime     = $file->getMimeType() ?: 'application/pdf';
        $size     = $file->getSize();
        $hash     = hash_file('sha256', $file->getRealPath());
    } else {
        // base64/data URL
        $base64 = $validated['pdf_base64'];
        if (str_starts_with($base64, 'data:')) {
            [, $base64] = explode(',', $base64, 2);
        }
        $binary = base64_decode($base64, true);
        if ($binary === false) {
            throw ValidationException::withMessages([
                'pdf_base64' => 'Invalid base64 data.',
            ]);
        }

        $filename = $validated['filename'] ?? 'contract-'.Str::uuid().'.pdf';
        if (!Str::of($filename)->lower()->endsWith('.pdf')) {
            $filename .= '.pdf';
        }

        $path = 'contracts/'.$filename;
        Storage::disk($disk)->put($path, $binary);

        $mime = 'application/pdf';
        $size = Storage::disk($disk)->size($path);
        $hash = hash('sha256', $binary);
    }

    // Create Blob row
    $blob = Blob::create([
        'disk'     => $disk,
        'path'     => $path,
        'filename' => $filename,
        'mime'     => $mime,
        'size'     => $size,
        'hash'     => $hash,
    ]);

    // Create Contract with required blob_id
    $contract = Contract::create([
        'transaction_id' => $validated['transaction_id'],
        'blob_id'        => $blob->id, // ✅ satisfies NOT NULL
    ]);

    return redirect()
        ->route('contracts.show', $contract)
        ->with('success', 'Contract PDF uploaded.');
    }
    public function show(Contract $contract)
    {
        $contract->load([
            'blob:id,disk,path,filename,mime,size',
            'transaction:id,reference,shipment_id',
            'transaction.shipment:id', // adjust if you have name fields etc.
        ]);

        // Try to generate a URL if the disk supports it (public/s3 etc.)
        $fileUrl = null;
        try {
            $fileUrl = $contract->blob
                ? Storage::disk($contract->blob->disk)->url($contract->blob->path)
                : null;
        } catch (\Throwable $e) {
            $fileUrl = null;
        }

        return Inertia::render('Contracts/Show', [
            'contract' => [
                'id'          => $contract->id,
                'created_at'  => $contract->created_at,
                'updated_at'  => $contract->updated_at,
                'blob'        => $contract->blob ? [
                    'id'       => $contract->blob->id,
                    'disk'     => $contract->blob->disk,
                    'path'     => $contract->blob->path,
                    'filename' => $contract->blob->filename,
                    'mime'     => $contract->blob->mime,
                    'size'     => $contract->blob->size,
                ] : null,
                'file_url'   => $fileUrl, // may be null if disk has no URL
            ],
        ]);
    }
    public function pdf(\App\Models\Contract $contract)
    {
        $contract->load('blob');
        abort_unless($contract->blob, 404, 'No file for this contract.');

        $disk = Storage::disk($contract->blob->disk);
        abort_unless($disk->exists($contract->blob->path), 404, 'File missing on disk.');

        // Inline response (so <iframe> renders it)
        return $disk->response(
            $contract->blob->path,
            $contract->blob->filename ?? 'contract.pdf',
            [
                'Content-Type'        => $contract->blob->mime ?: 'application/pdf',
                'Content-Disposition' => 'inline; filename="'.($contract->blob->filename ?? 'contract.pdf').'"',
                'Cache-Control'       => 'private, max-age=0, must-revalidate',
            ]
        );
    }
}
