import { Head } from '@inertiajs/react';

type Contract = {
    id: string;
    transaction: {
        id: string;
        reference: string;
    };
};

type ShipmentGroup = {
    shipment: {
        id: string;
        name: string;
    };
    contracts: Contract[];
};

type ContractsIndexProps = {
    contractsByShipment: ShipmentGroup[];
};

export default function ContractsIndex({ contractsByShipment }: ContractsIndexProps) {
    return (
        <>
            <Head title="Contracts" />
            <div className="container mx-auto py-8">
                <h1 className="mb-8 text-3xl font-bold">Contracts Grouped by Shipment</h1>
                <div className="space-y-8">
                    {contractsByShipment.length === 0 ? (
                        <div className="text-muted-foreground">No contracts found.</div>
                    ) : (
                        contractsByShipment.map((group) => (
                            <div key={group.shipment.id} className="rounded-lg border bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-xl font-semibold">
                                    Shipment: <span className="text-primary">{group.shipment.name}</span>
                                </h2>
                                <ul className="space-y-2">
                                    {group.contracts.map((contract) => (
                                        <li key={contract.id} className="flex items-center gap-2 text-sm">
                                            <span className="font-mono text-muted-foreground">#{contract.id}</span>
                                            <span>–</span>
                                            <span>
                                                Transaction: <span className="font-semibold">{contract.transaction.reference}</span>
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}
