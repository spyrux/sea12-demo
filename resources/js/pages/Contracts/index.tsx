import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Head, Link } from '@inertiajs/react';

type Party = { id: string | number; name: string; type?: string | null };

type Transaction = {
    id: string | number;
    reference?: string | null;
    shipment_id: string | number;
    transaction_date?: string | null;
    transaction_type?: string | null;
    total_value?: number | null;
    created_at?: string;
    updated_at?: string;
    parties?: Party[];
    contract_ids?: (string | number)[];
};

type ContractsIndexProps = {
    transactionsWithoutContracts: Transaction[];
    transactionsWithContracts: Transaction[];
};

type ShipmentGroup = {
    shipment_id: string;
    transactions: Transaction[];
    total_value: number;
    count: number;
};

function groupByShipment(transactions: Transaction[]): ShipmentGroup[] {
    const groups: Record<string, ShipmentGroup> = {};
    for (const t of transactions ?? []) {
        const key = String(t.shipment_id);
        if (!groups[key]) {
            groups[key] = { shipment_id: key, transactions: [], total_value: 0, count: 0 };
        }
        groups[key].transactions.push(t);
        groups[key].count += 1;
        groups[key].total_value += Number(t.total_value ?? 0);
    }
    // sort shipments by id (optional)
    return Object.values(groups).sort((a, b) => a.shipment_id.localeCompare(b.shipment_id));
}

export default function ContractsIndex({ transactionsWithoutContracts, transactionsWithContracts }: ContractsIndexProps) {
    const withContracts = transactionsWithContracts ?? [];
    const withoutContracts = transactionsWithoutContracts ?? [];

    const groupedWith = groupByShipment(withContracts);
    const groupedWithout = groupByShipment(withoutContracts);

    return (
        <>
            <Head title="Contract Management" />
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Contracts</h1>
                        <p className="text-muted-foreground">Management of your contracts</p>
                    </div>
                </div>
                {/* Transactions WITHOUT Contracts (grouped by shipment) */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">Transactions without Contracts</h2>
                    {groupedWithout.length > 0 ? (
                        <Accordion type="multiple" className="w-full">
                            {groupedWithout.map((g) => (
                                <AccordionItem key={`without-${g.shipment_id}`} value={`without-${g.shipment_id}`}>
                                    <AccordionTrigger className="cursor-pointer rounded-md px-4 hover:bg-muted">
                                        <div className="flex w-full items-center justify-between">
                                            <div className="text-left">
                                                <h3 className="text-lg font-medium">
                                                    <Link href={`/shipments/${g.shipment_id}`} className="hover:underline">
                                                        Shipment #{g.shipment_id}
                                                    </Link>
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {g.count} transaction{g.count === 1 ? '' : 's'}
                                                </p>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="px-4">
                                        {g.transactions.map((t) => (
                                            <AccordionItem key={t.id} value={String(t.id)}>
                                                <div className="flex items-center justify-between rounded p-3 hover:bg-muted">
                                                    <div>
                                                        <span className="font-medium">Transaction: {t.reference ?? `TX-${t.id}`}</span>
                                                        <p className="text-sm text-muted-foreground">No contract assigned</p>
                                                    </div>
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link href={`/contracts/create?transaction_id=${t.id}`}>Upload Contract</Link>
                                                    </Button>
                                                </div>
                                            </AccordionItem>
                                        ))}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    ) : (
                        <p className="text-muted-foreground">All transactions have contracts.</p>
                    )}
                </div>

                {/* Transactions WITH Contracts (grouped by shipment) */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">Transactions with Contracts</h2>
                    {groupedWith.length > 0 ? (
                        <Accordion type="multiple" className="w-full">
                            {groupedWith.map((g) => (
                                <AccordionItem key={`with-${g.shipment_id}`} value={`with-${g.shipment_id}`}>
                                    <AccordionTrigger className="cursor-pointer rounded-md px-4 hover:bg-muted">
                                        <div className="flex w-full items-center justify-between">
                                            <div className="text-left">
                                                <h3 className="text-lg font-medium">
                                                    <Link href={`/shipments/${g.shipment_id}`} className="hover:underline">
                                                        Shipment #{g.shipment_id}
                                                    </Link>
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {g.count} transaction{g.count === 1 ? '' : 's'}
                                                </p>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="px-4">
                                        {g.transactions.map((t) => (
                                            <AccordionItem key={t.id} value={String(t.id)}>
                                                <div className="space-y-2">
                                                    {(t.contract_ids ?? []).map((cid) => (
                                                        <div key={cid} className="flex items-center justify-between rounded bg-muted p-3">
                                                            <div>
                                                                <span className="font-medium">Contract ID: {cid}</span>
                                                                <p className="text-sm text-muted-foreground">
                                                                    Transaction: {t.reference ?? `TX-${t.id}`}
                                                                </p>
                                                            </div>
                                                            <Button variant="outline" size="sm" asChild>
                                                                <Link href={`/contracts/${cid}`}>View Contract</Link>
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </AccordionItem>
                                        ))}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    ) : (
                        <p className="text-muted-foreground">No transactions with contracts found.</p>
                    )}
                </div>
            </div>
        </>
    );
}
