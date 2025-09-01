import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, usePage } from '@inertiajs/react';
import { Activity, DollarSign, FileText } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type KPI = {
    totalValue: number;
    transactions: number;
    contracts: number;
    avgValue: number;
    from: string;
    to: string;
};

type TimePoint = { date: string; value: number; count: number };
type TypeBucket = { type: string; count: number; total: number };
type ShipmentRow = { shipment_id: string | number; count: number; total: number };

type PageProps = {
    kpis: KPI;
    timeSeries: TimePoint[];
    byType: TypeBucket[];
    topShipments: ShipmentRow[];
};

function money(n: number) {
    return Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n || 0);
}

export default function AnalyticsIndex() {
    const { kpis, timeSeries, byType, topShipments } = usePage<PageProps>().props;

    // Debug logging to check what data is coming from backend
    console.log('KPI Data:', kpis);
    console.log('Time Series Data:', timeSeries);
    console.log('By Type Data:', byType);
    console.log('Top Shipments Data:', topShipments);

    return (
        <>
            <Head title="Analytics" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                        <p className="text-muted-foreground">
                            {kpis?.from || 'N/A'} → {kpis?.to || 'N/A'}
                        </p>
                    </div>
                    <Badge variant="secondary">Last 30 days</Badge>
                </div>

                {/* KPI cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{money(kpis?.totalValue || 0)}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{kpis?.transactions || 0}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Contracts</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{kpis?.contracts || 0}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg. Value</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{money(kpis?.avgValue || 0)}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Time series */}
                <Card>
                    <CardHeader>
                        <CardTitle>Value over Time</CardTitle>
                    </CardHeader>
                    <CardContent className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={timeSeries}>
                                <defs>
                                    <linearGradient id="v" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopOpacity={0.25} />
                                        <stop offset="95%" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : `${v}`)} />
                                <Tooltip formatter={(val: number | string) => money(Number(val))} />
                                <Legend />
                                <Area type="monotone" dataKey="value" strokeWidth={2} fillOpacity={1} fill="url(#v)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* By type + Top shipments */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>By Transaction Type</CardTitle>
                        </CardHeader>
                        <CardContent className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={byType}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="type" />
                                    <YAxis />
                                    <Tooltip
                                        wrapperClassName="bg-background"
                                        formatter={(val: number | string, name: string | number) => (name === 'total' ? money(Number(val)) : val)}
                                    />
                                    <Legend />
                                    <Bar dataKey="count" fill="#8884d8" />
                                    <Bar dataKey="total" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Top Shipments (by value)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {topShipments.length === 0 && <p className="text-sm text-muted-foreground">No data</p>}
                            {topShipments.map((s) => (
                                <div key={String(s.shipment_id)} className="flex items-center justify-between rounded border p-3">
                                    <span className="text-sm">
                                        Shipment #{s.shipment_id} ({s.count})
                                    </span>
                                    <span className="font-medium">{money(s.total)}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
