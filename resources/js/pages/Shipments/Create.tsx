import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Calendar, Save, Ship } from 'lucide-react';

interface PageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
}

interface Props extends PageProps {
    statuses: string[];
    vessels?: Array<{ id: string; name: string }>;
    locations?: Array<{ id: string; name: string }>;
}

export default function Create({ statuses, vessels = [], locations = [] }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        status: 'PLANNED',
        cargo_sailing_date: '',
        eta: '',
        vessel_id: '',
        origin_id: '',
        destination_id: '',
        reason: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/shipments', {
            onSuccess: () => {
                // Redirect to home page after successful creation
                window.location.href = '/shipments';
            },
        });
    };

    return (
        <>
            <Head title="Create Shipment" />

            <div className="flex min-h-screen items-center justify-center p-6">
                <div className="w-full max-w-2xl">
                    {/* Header */}
                    <div className="mb-6 flex items-center space-x-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/shipments">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Create Shipment</h1>
                            <p className="text-muted-foreground">Set up a new cargo shipment with all the necessary details</p>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Ship className="h-5 w-5" />
                                <span>Shipment Details</span>
                            </CardTitle>
                            <CardDescription>Fill in the details below to create a new shipment</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Status */}
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statuses.map((status) => (
                                                <SelectItem key={status} value={status}>
                                                    {status.replace('_', ' ')}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
                                </div>

                                {/* Vessel */}
                                <div className="space-y-2">
                                    <Label htmlFor="vessel_id">Vessel (Optional)</Label>
                                    <Select
                                        value={data.vessel_id || 'none'}
                                        onValueChange={(value) => setData('vessel_id', value === 'none' ? '' : value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select vessel" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">No vessel assigned</SelectItem>
                                            {vessels.map((vessel) => (
                                                <SelectItem key={vessel.id} value={vessel.id}>
                                                    {vessel.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.vessel_id && <p className="text-sm text-destructive">{errors.vessel_id}</p>}
                                </div>

                                {/* Origin */}
                                <div className="space-y-2">
                                    <Label htmlFor="origin_id">Origin *</Label>
                                    <Select value={data.origin_id} onValueChange={(value) => setData('origin_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select origin location" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {locations.map((location) => (
                                                <SelectItem key={location.id} value={location.id}>
                                                    {location.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.origin_id && <p className="text-sm text-destructive">{errors.origin_id}</p>}
                                </div>

                                {/* Destination */}
                                <div className="space-y-2">
                                    <Label htmlFor="destination_id">Destination *</Label>
                                    <Select value={data.destination_id} onValueChange={(value) => setData('destination_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select destination location" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {locations.map((location) => (
                                                <SelectItem key={location.id} value={location.id}>
                                                    {location.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.destination_id && <p className="text-sm text-destructive">{errors.destination_id}</p>}
                                </div>

                                {/* Dates */}
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="cargo_sailing_date">Cargo Sailing Date</Label>
                                        <div className="relative">
                                            <Calendar className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                id="cargo_sailing_date"
                                                type="date"
                                                value={data.cargo_sailing_date}
                                                onChange={(e) => setData('cargo_sailing_date', e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                        {errors.cargo_sailing_date && <p className="text-sm text-destructive">{errors.cargo_sailing_date}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="eta">Estimated Time of Arrival</Label>
                                        <div className="relative">
                                            <Calendar className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                id="eta"
                                                type="date"
                                                value={data.eta}
                                                onChange={(e) => setData('eta', e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                        {errors.eta && <p className="text-sm text-destructive">{errors.eta}</p>}
                                    </div>
                                </div>

                                {/* Reason */}
                                <div className="space-y-2">
                                    <Label htmlFor="reason">Reason for Creation (Optional)</Label>
                                    <Input
                                        id="reason"
                                        type="text"
                                        value={data.reason}
                                        onChange={(e) => setData('reason', e.target.value)}
                                        placeholder="Brief description of why this shipment is being created"
                                    />
                                    {errors.reason && <p className="text-sm text-destructive">{errors.reason}</p>}
                                </div>

                                {/* Form Actions */}
                                <div className="flex items-center justify-end space-x-4 pt-6">
                                    <Button variant="outline" asChild>
                                        <Link href="/dashboard">Cancel</Link>
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        <Save className="mr-2 h-4 w-4" />
                                        {processing ? 'Creating...' : 'Create Shipment'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
