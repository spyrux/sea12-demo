import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Calendar, MapPin, Plus, Ship } from 'lucide-react';
interface PageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
}

interface Shipment {
    id: string;
    status: string;
    cargo_sailing_date?: string;
    eta?: string;
    latest?: {
        vessel?: { name: string };
        origin?: { name: string };
        destination?: { name: string };
    };
}

interface Props extends PageProps {
    shipments: {
        data: Shipment[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

const statusColors = {
    PLANNED: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    IN_TRANSIT: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    ARRIVED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    CLOSED: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
};

export default function Index({ shipments }: Props) {
    return (
        <>
            <Head title="Shipments" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Shipments</h1>
                        <p className="text-muted-foreground">Manage and track your cargo shipments</p>
                    </div>
                    <Button asChild>
                        <Link href="/shipments/create">
                            <Plus className="h-4 w-4" />
                            New Shipment
                        </Link>
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
                            <Ship className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{shipments.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
                            <Ship className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{shipments.data.filter((s) => s.status === 'IN_TRANSIT').length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Arrived</CardTitle>
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{shipments.data.filter((s) => s.status === 'ARRIVED').length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Planned</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{shipments.data.filter((s) => s.status === 'PLANNED').length}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Shipments List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Shipments</CardTitle>
                        <CardDescription>A list of all your cargo shipments and their current status.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {shipments.data.length === 0 ? (
                            <div className="py-12 text-center">
                                <Ship className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-semibold">No shipments found</h3>
                                <p className="mt-2 text-muted-foreground">Get started by creating your first shipment.</p>
                                <Button asChild className="mt-4">
                                    <Link href="/shipments/create">
                                        <Plus className="h-4 w-4" />
                                        Create Shipment
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {shipments.data.map((shipment) => (
                                    <div
                                        key={shipment.id}
                                        className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                <Ship className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center space-x-2">
                                                    <p className="truncate text-sm font-medium">
                                                        {shipment.latest?.vessel?.name || 'Unassigned Vessel'}
                                                    </p>
                                                    <Badge variant="outline" className={statusColors[shipment.status as keyof typeof statusColors]}>
                                                        {shipment.status.replace('_', ' ')}
                                                    </Badge>
                                                </div>
                                                <div className="mt-1 flex items-center space-x-4 text-sm text-muted-foreground">
                                                    <div className="flex items-center space-x-1">
                                                        <MapPin className="h-3 w-3" />
                                                        <span>
                                                            {shipment.latest?.origin?.name} → {shipment.latest?.destination?.name}
                                                        </span>
                                                    </div>
                                                    {shipment.cargo_sailing_date && (
                                                        <div className="flex items-center space-x-1">
                                                            <Calendar className="h-3 w-3" />
                                                            <span>Sails: {new Date(shipment.cargo_sailing_date).toLocaleDateString()}</span>
                                                        </div>
                                                    )}
                                                    {shipment.eta && (
                                                        <div className="flex items-center space-x-1">
                                                            <Calendar className="h-3 w-3" />
                                                            <span>ETA: {new Date(shipment.eta).toLocaleDateString()}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/shipments/${shipment.id}`}>
                                                <ArrowRight className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pagination */}
                {shipments.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing {(shipments.current_page - 1) * shipments.per_page + 1} to{' '}
                            {Math.min(shipments.current_page * shipments.per_page, shipments.total)} of {shipments.total} results
                        </p>
                        <div className="flex items-center space-x-2">
                            {shipments.current_page > 1 && (
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/shipments?page=${shipments.current_page - 1}`}>Previous</Link>
                                </Button>
                            )}
                            {shipments.current_page < shipments.last_page && (
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/shipments?page=${shipments.current_page + 1}`}>Next</Link>
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
