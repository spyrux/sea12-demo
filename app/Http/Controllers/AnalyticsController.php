<?php

namespace App\Http\Controllers;

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    public function index()
    {
        $to   = now()->endOfDay();
        $from = now()->subDays(30)->startOfDay();

        // Pick date column
        $dateCol = Schema::hasColumn('transactions', 'tx_date') ? 'tx_date' : 'created_at';

        // Detect type column (optional)
        $typeCol = Schema::hasColumn('transactions', 'type')
            ? 'type'
            : (Schema::hasColumn('transactions', 'transaction_type') ? 'transaction_type' : null);

        // Detect lines table
        $linesTable = Schema::hasTable('transaction_lines') ? 'transaction_lines'
            : (Schema::hasTable('lines') ? 'lines' : null);

        // Detect amount expression on lines
        $amtCol = null;
        if ($linesTable) {
            foreach (['line_value', 'total_amount', 'amount'] as $col) {
                if (Schema::hasColumn($linesTable, $col)) { $amtCol = $col; break; }
            }
        }

        $driver   = DB::getDriverName();
        $dateExpr = $driver === 'pgsql'
            ? "date_trunc('day', t.$dateCol)"
            : "date(t.$dateCol)";

        // SUM(...) expression for lines
        if ($linesTable && $amtCol) {
            // cast to numeric for SQLite safety
            $sumExpr = $driver === 'sqlite'
                ? "SUM(COALESCE(CAST(l.$amtCol AS REAL),0))"
                : "SUM(COALESCE(l.$amtCol,0))";
        } elseif ($linesTable && Schema::hasColumn($linesTable, 'quantity') && Schema::hasColumn($linesTable, 'unit_price')) {
            $sumExpr = $driver === 'sqlite'
                ? "SUM(COALESCE(CAST(l.quantity AS REAL),0) * COALESCE(CAST(l.unit_price AS REAL),0))"
                : "SUM(COALESCE(l.quantity,0) * COALESCE(l.unit_price,0))";
        } else {
            // No lines table/columns found → everything zero
            $sumExpr = null;
        }

        $cacheKey = "analytics:lines:$linesTable:$amtCol:$dateCol:$typeCol:$from:$to";

        return Cache::remember($cacheKey, now()->addMinutes(5), function () use ($from, $to, $dateCol, $typeCol, $linesTable, $sumExpr, $dateExpr) {
            $base = fn () => DB::table('transactions as t')->whereBetween("t.$dateCol", [$from, $to]);

            if (!$sumExpr || !$linesTable) {
                // Fallback: zero totals but keep counts (no lines detected)
                $txCount = (int) $base()->count();
                $contractsCount = (int) DB::table('contracts')->whereBetween('created_at', [$from, $to])->count();

                return Inertia::render('Analytics/Index', [
                    'kpis' => [
                        'totalValue'   => 0.0,
                        'transactions' => $txCount,
                        'contracts'    => $contractsCount,
                        'avgValue'     => 0.0,
                        'from'         => $from->toDateString(),
                        'to'           => $to->toDateString(),
                    ],
                    'timeSeries'   => [],
                    'byType'       => [],
                    'topShipments' => [],
                ]);
            }

            // Totals from lines
            $totalValue = (float) ($base()
                ->leftJoin("$linesTable as l", 'l.transaction_id', '=', 't.id')
                ->selectRaw("$sumExpr as v")
                ->value('v') ?? 0);

            $txCount = (int) $base()->count();
            $contractsCount = (int) DB::table('contracts')->whereBetween('created_at', [$from, $to])->count();
            $avgValue = $txCount ? round($totalValue / $txCount, 2) : 0.0;

            // Time series: sum of line amounts per day, counting distinct tx
            $timeSeries = $base()
                ->leftJoin("$linesTable as l", 'l.transaction_id', '=', 't.id')
                ->selectRaw("$dateExpr as d, $sumExpr as v, COUNT(DISTINCT t.id) as c")
                ->groupBy('d')->orderBy('d')
                ->get()
                ->map(fn ($r) => [
                    'date'  => is_string($r->d) ? $r->d : Carbon::parse($r->d)->toDateString(),
                    'value' => (float) $r->v,
                    'count' => (int) $r->c,
                ]);

            // By type: sum of line amounts by t.type (if exists)
            $byType = $typeCol
                ? $base()
                    ->leftJoin("$linesTable as l", 'l.transaction_id', '=', 't.id')
                    ->selectRaw("t.$typeCol as type, COUNT(DISTINCT t.id) as count, $sumExpr as total")
                    ->groupBy("t.$typeCol")
                    ->orderByDesc('total')
                    ->get()
                    ->map(fn ($r) => [
                        'type'  => (string) ($r->type ?? 'Unknown'),
                        'count' => (int) $r->count,
                        'total' => (float) $r->total,
                    ])
                : collect();

            // Top shipments: sum of line amounts by shipment
            $topShipments = $base()
                ->leftJoin("$linesTable as l", 'l.transaction_id', '=', 't.id')
                ->selectRaw("t.shipment_id, $sumExpr as total, COUNT(DISTINCT t.id) as count")
                ->groupBy('t.shipment_id')
                ->orderByDesc('total')
                ->limit(10)
                ->get()
                ->map(fn ($r) => [
                    'shipment_id' => $r->shipment_id,
                    'count'       => (int) $r->count,
                    'total'       => (float) $r->total,
                ]);

            return Inertia::render('Analytics/Index', [
                'kpis'        => [
                    'totalValue'   => $totalValue,
                    'transactions' => $txCount,
                    'contracts'    => $contractsCount,
                    'avgValue'     => $avgValue,
                    'from'         => $from->toDateString(),
                    'to'           => $to->toDateString(),
                ],
                'timeSeries'   => $timeSeries,
                'byType'       => $byType,
                'topShipments' => $topShipments,
            ]);
        });
    }
}
