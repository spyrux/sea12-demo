import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Edit, MapPin, Ship, User } from 'lucide-react';

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

export default function Show({ shipment }: Props) {
    const latestVersion = shipment.versions[0]; // Assuming versions are ordered by latest first

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
                        {/* Current Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Ship className="h-5 w-5" />
                                    <span>Current Status</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">Status</span>
                                        <Badge className={statusColors[shipment.latest.status as keyof typeof statusColors]}>
                                            {shipment.latest.status.replace('_', ' ')}
                                        </Badge>
                                    </div>

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
                                            <span className="font-medium">Estimated Time of Arrival</span>
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span>{new Date(shipment.latest.eta).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Route Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <MapPin className="h-5 w-5" />
                                    <span>Route Information</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
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

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Shipment ID */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Shipment Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-sm font-medium text-muted-foreground">Shipment ID</span>
                                        <p className="font-mono text-sm">{shipment.id}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-muted-foreground">Total Versions</span>
                                        <p className="text-sm">{shipment.versions.length}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-muted-foreground">Created</span>
                                        <p className="text-sm">
                                            {new Date(shipment.versions[shipment.versions.length - 1]?.created_at || '').toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-muted-foreground">Last Updated</span>
                                        <p className="text-sm">{new Date(latestVersion?.created_at || '').toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <Button variant="outline" className="w-full justify-start" asChild>
                                        <Link href={`/shipments/${shipment.id}/edit`}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit Shipment
                                        </Link>
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start" asChild>
                                        <Link href="/dashboard">
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Back to Dashboard
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
