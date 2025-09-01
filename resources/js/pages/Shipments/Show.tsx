import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, DollarSign, Edit, Package, Plus, Ship, User } from 'lucide-react';
interface PageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
}

interface ShipmentVersion {
    id: string;
    version: number;
    status: string;
    cargo_sailing_date?: string;
    eta?: string;
    created_at: string;
    actor_id?: string;
    reason?: string;
    actor?: { name: string };
}

interface ShipmentItem {
    id: string;
    description: string;
    quantity: number;
    unit: string;
    unit_price: number;
    total_price: number;
    created_at: string;
}

interface TransactionLine {
    id: string;
    description: string;
    quantity: number;
    unit_price: number;
    total_amount: number;
    transaction_type: string;
    created_at: string;
}

interface Transaction {
    id: string;
    transaction_date: string;
    reference: string;
    total_amount: number;
    transaction_type: string;
    created_at: string;
    lines: TransactionLine[];
    parties: Array<{
        id: string;
        name: string;
        type: string;
    }>;
}

interface Shipment {
    id: string;
    latest: {
        status: string;
        cargo_sailing_date?: string;
        eta?: string;
        vessel?: { name: string };
        origin?: { name: string };
        destination?: { name: string };
    };
    versions: ShipmentVersion[];
    items?: ShipmentItem[];
    transactions?: Transaction[];
}

interface Props extends PageProps {
    shipment: Shipment;
}

const statusColors = {
    PLANNED: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    IN_TRANSIT: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    ARRIVED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    CLOSED: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
};

const transactionTypeColors = {
    PURCHASE: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    SALE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    FREIGHT: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    INSURANCE: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    UNKNOWN: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
};

export default function Show({ shipment }: Props) {
    const latestVersion = shipment.versions[0]; // Assuming versions are ordered by latest first
    const items = shipment.items || [];
    const transactions = shipment.transactions || [];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    return (
        <>
            <Head title={`Shipment ${shipment.id}`} />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/dashboard">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Shipment Details</h1>
                            <p className="text-muted-foreground">View and manage shipment information</p>
                        </div>
                    </div>
                    <Button asChild>
                        <Link href={`/shipments/${shipment.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Shipment
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center space-x-2">
                                        <DollarSign className="h-5 w-5" />
                                        <span>Transactions</span>
                                    </CardTitle>
                                    <Button size="sm" variant="outline" asChild>
                                        <Link href={`/shipments/${shipment.id}/transactions/create`}>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Transaction
                                        </Link>
                                    </Button>
                                </div>
                                <CardDescription>{transactions.length} transaction(s) for this shipment</CardDescription>
                            </CardHeader>

                            <CardContent>
                                {transactions.length > 0 ? (
                                    <>
                                        <Accordion type="multiple" className="w-full rounded-md border p-6">
                                            {transactions.map((t) => (
                                                <AccordionItem key={t.id} value={t.id}>
                                                    <AccordionTrigger className="group cursor-pointer gap-3">
                                                        <div className="flex min-w-0 flex-1 items-center gap-2 text-left">
                                                            <Badge
                                                                className={
                                                                    transactionTypeColors[t.transaction_type as keyof typeof transactionTypeColors]
                                                                }
                                                            >
                                                                {t.transaction_type}
                                                            </Badge>
                                                            <span className="truncate font-medium">{t.reference}</span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {new Date(t.transaction_date).toLocaleDateString()}
                                                            </span>
                                                            {t.parties.length > 0 && (
                                                                <span className="hidden truncate text-xs text-muted-foreground md:inline">
                                                                    • {t.parties.map((p) => p.name).join(', ')}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-xs text-muted-foreground">{t.lines.length} line(s)</span>
                                                            <span className="font-medium">{formatCurrency(t.total_amount)}</span>
                                                        </div>
                                                    </AccordionTrigger>

                                                    <AccordionContent>
                                                        <div className="space-y-2">
                                                            {t.lines.length > 0 ? (
                                                                t.lines.map((line) => (
                                                                    <div
                                                                        key={line.id}
                                                                        className="flex items-center justify-between rounded-md bg-muted/40 p-3"
                                                                    >
                                                                        <div className="min-w-0">
                                                                            <p className="truncate text-sm font-medium">{line.description}</p>
                                                                            <p className="text-xs text-muted-foreground">
                                                                                {line.quantity} × {formatCurrency(line.unit_price)}
                                                                            </p>
                                                                        </div>
                                                                        <span className="text-sm font-medium">
                                                                            {formatCurrency(line.total_amount)}
                                                                        </span>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <p className="text-sm text-muted-foreground">No lines</p>
                                                            )}
                                                        </div>

                                                        <Separator className="my-3" />

                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-muted-foreground">Total</span>
                                                            <span className="font-medium">{formatCurrency(t.total_amount)}</span>
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    </>
                                ) : (
                                    <div className="py-8 text-center">
                                        <DollarSign className="mx-auto h-12 w-12 text-muted-foreground" />
                                        <h3 className="mt-2 text-sm font-medium text-muted-foreground">No transactions</h3>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Get started by adding financial transactions to this shipment.
                                        </p>
                                        <div className="mt-6">
                                            <Button asChild>
                                                <Link href={`/shipments/${shipment.id}/transactions/create`}>
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Add Transaction
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center space-x-2">
                                        <Package className="h-5 w-5" />
                                        <span>Shipment Items</span>
                                    </CardTitle>
                                </div>
                                <CardDescription>{items.length} item(s) in this shipment</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {items.length > 0 ? (
                                    <div className="space-y-4">
                                        {items.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-1">
                                                    <p className="font-medium">{item.description}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {item.quantity} {item.unit} × {formatCurrency(item.unit_price)}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium">{formatCurrency(item.total_price)}</p>
                                                    <p className="text-sm text-muted-foreground">{new Date(item.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">Total Cargo Value</span>
                                            <span className="font-bold">
                                                {formatCurrency(items.reduce((sum, item) => sum + item.total_price, 0))}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-8 text-center">
                                        <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                                        <h3 className="mt-2 text-sm font-medium text-muted-foreground">No cargo items</h3>
                                        <p className="mt-1 text-sm text-muted-foreground">Get started by adding cargo items to this shipment.</p>
                                        <div className="mt-6">
                                            <Button asChild>
                                                <Link href={`/shipments/${shipment.id}/items/create`}>
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Add Item
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Current Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Ship className="h-5 w-5" />
                                    <span>Shipment Information</span>
                                </CardTitle>
                                <CardDescription>Key details at a glance</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Status */}
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">Status</span>
                                        <Badge className={statusColors[shipment.latest.status as keyof typeof statusColors]}>
                                            {shipment.latest.status.replace('_', ' ')}
                                        </Badge>
                                    </div>

                                    {/* Dates */}
                                    {shipment.latest.cargo_sailing_date && (
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">Cargo Sailing Date</span>
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span>{new Date(shipment.latest.cargo_sailing_date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    )}
                                    {shipment.latest.eta && (
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">Estimated Arrival</span>
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span>{new Date(shipment.latest.eta).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    )}

                                    <Separator />

                                    {/* Route */}
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">Origin</span>
                                        <span className="text-muted-foreground">{shipment.latest?.origin?.name || 'Not specified'}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">Destination</span>
                                        <span className="text-muted-foreground">{shipment.latest?.destination?.name || 'Not specified'}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">Vessel</span>
                                        <span className="text-muted-foreground">{shipment.latest?.vessel?.name || 'Not assigned'}</span>
                                    </div>

                                    <Separator />

                                    {/* Meta */}
                                    <div className="space-y-3">
                                        <div>
                                            <span className="text-sm font-medium text-muted-foreground">Shipment ID</span>
                                            <p className="font-mono text-sm break-all">{shipment.id}</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <span className="text-sm font-medium text-muted-foreground">Versions</span>
                                                <p className="text-sm">{shipment.versions.length}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-sm font-medium text-muted-foreground">Items</span>
                                                <p className="text-sm">{items.length}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-sm font-medium text-muted-foreground">Transactions</span>
                                                <p className="text-sm">{transactions.length}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-sm font-medium text-muted-foreground">Created</span>
                                                <p className="text-sm">
                                                    {new Date(shipment.versions[shipment.versions.length - 1]?.created_at || '').toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="col-span-2 space-y-1">
                                                <span className="text-sm font-medium text-muted-foreground">Last Updated</span>
                                                <p className="text-sm">{new Date(latestVersion?.created_at || '').toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Version History */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Version History</CardTitle>
                                <CardDescription>Track all changes made to this shipment</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {shipment.versions.map((version, index) => (
                                        <div key={version.id} className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                                                        v{version.version}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center space-x-2">
                                                            <Badge
                                                                variant="outline"
                                                                className={statusColors[version.status as keyof typeof statusColors]}
                                                            >
                                                                {version.status.replace('_', ' ')}
                                                            </Badge>
                                                            <span className="text-sm text-muted-foreground">
                                                                {new Date(version.created_at).toLocaleString()}
                                                            </span>
                                                        </div>
                                                        {version.reason && <p className="mt-1 text-sm text-muted-foreground">{version.reason}</p>}
                                                    </div>
                                                </div>
                                                {version.actor_id && (
                                                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                                        <User className="h-4 w-4" />
                                                        <span>User {version.actor?.name || 'Unknown'}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {(version.cargo_sailing_date || version.eta) && (
                                                <div className="ml-11 space-y-2">
                                                    {version.cargo_sailing_date && (
                                                        <div className="flex items-center space-x-2 text-sm">
                                                            <Calendar className="h-3 w-3 text-muted-foreground" />
                                                            <span>Sails: {new Date(version.cargo_sailing_date).toLocaleDateString()}</span>
                                                        </div>
                                                    )}
                                                    {version.eta && (
                                                        <div className="flex items-center space-x-2 text-sm">
                                                            <Calendar className="h-3 w-3 text-muted-foreground" />
                                                            <span>ETA: {new Date(version.eta).toLocaleDateString()}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {index < shipment.versions.length - 1 && <Separator className="ml-11" />}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
