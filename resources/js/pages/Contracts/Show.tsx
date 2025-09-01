import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePage } from '@inertiajs/react';
import { Building, Calendar, Clock, DollarSign, Eye, FileText, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface Contract {
    id: string;
    title: string;
    contractNumber: string;
    status: 'active' | 'expired' | 'pending' | 'terminated';
    startDate: string;
    endDate: string;
    value: number;
    currency: string;
    client: {
        name: string;
        email: string;
        phone: string;
    };
    vendor: {
        name: string;
        email: string;
        phone: string;
    };
    description: string;
    terms: string;
    pdfUrl: string;
    createdAt: string;
    updatedAt: string;
}
type PageProps = { contract: { id: string; file_url?: string | null } };
const ContractShow: React.FC = () => {
    const page = usePage<PageProps>();
    const [contract, setContract] = useState<Contract | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API call to fetch contract data
        const fetchContract = async () => {
            try {
                // Use Inertia-provided contract data instead of mock
                const contractData = page.props.contract;
                if (!contractData) throw new Error('No contract data found');
                const mockContract: Contract = {
                    id: contractData.id,
                    title: 'Contract',
                    contractNumber: contractData.id,
                    status: 'active',
                    startDate: '2024-01-15',
                    endDate: '2024-12-31',
                    value: 50000,
                    currency: 'USD',
                    client: {
                        name: 'Acme Corporation',
                        email: 'contracts@acme.com',
                        phone: '+1-555-0123',
                    },
                    vendor: {
                        name: 'Tech Solutions Inc.',
                        email: 'legal@techsolutions.com',
                        phone: '+1-555-0456',
                    },
                    description:
                        'Comprehensive software development services including web application development, API integration, and ongoing maintenance.',
                    terms: 'Payment terms: 50% upfront, 25% at milestone completion, 25% upon final delivery. Intellectual property rights transfer upon final payment.',
                    pdfUrl: '/api/contracts/1/pdf',
                    createdAt: '2024-01-10T10:00:00Z',
                    updatedAt: '2024-01-15T14:30:00Z',
                };

                setContract(mockContract);
            } catch (error) {
                console.error('Error fetching contract:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchContract();
    }, [page.props.contract.id]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'expired':
                return 'bg-red-100 text-red-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'terminated':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(amount);
    };

    const backend = import.meta.env.VITE_BACKEND_URL ?? ''; // e.g. http://localhost:8000
    const pdfUrl = contract ? `${backend}/contracts/${contract.id}/pdf` : ''; // <-- this must reach Laravel

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!contract) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <h2 className="mb-2 text-2xl font-bold text-gray-900">Contract Not Found</h2>
                    <p className="text-gray-300">The contract you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">{contract.title}</h1>
                        <p className="mt-2">Contract #{contract.contractNumber}</p>
                    </div>
                    <div className="flex gap-3">
                        <Button asChild variant="outline">
                            <a
                                href={pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                // (optional) if this lives inside an Accordion/Disclosure, stop toggle:
                                onClick={(e) => e.stopPropagation?.()}
                                aria-label="View PDF in a new tab"
                            >
                                <Eye className="h-4 w-4" />
                                View PDF
                            </a>
                        </Button>
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-4">
                    <Badge className={getStatusColor(contract.status)}>{contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}</Badge>
                    <span className="text-sm text-gray-200">Created: {formatDate(contract.createdAt)}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Main Content */}
                <div className="space-y-6 lg:col-span-2">
                    {/* PDF Viewer */}

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Contract Document
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-lg border bg-gray-50 p-4">
                                <iframe allowFullScreen src={pdfUrl} className="h-96 w-full border-0" title="Contract PDF" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Description */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="leading-relaxed text-gray-400">{contract.description}</p>
                        </CardContent>
                    </Card>

                    {/* Terms */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Terms & Conditions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="leading-relaxed text-gray-400">{contract.terms}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Contract Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Contract Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-gray-200" />
                                <div>
                                    <p className="text-sm font-medium">Start Date</p>
                                    <p className="text-sm text-gray-300">{formatDate(contract.startDate)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-gray-200" />
                                <div>
                                    <p className="text-sm font-medium">End Date</p>
                                    <p className="text-sm text-gray-300">{formatDate(contract.endDate)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <DollarSign className="h-4 w-4 text-gray-200" />
                                <div>
                                    <p className="text-sm font-medium">Contract Value</p>
                                    <p className="text-sm text-gray-300">{formatCurrency(contract.value, contract.currency)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock className="h-4 w-4 text-gray-200" />
                                <div>
                                    <p className="text-sm font-medium">Last Updated</p>
                                    <p className="text-sm text-gray-300">{formatDate(contract.updatedAt)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Client Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Client Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium">{contract.client.name}</p>
                                <p className="text-sm text-gray-300">{contract.client.email}</p>
                                <p className="text-sm text-gray-300">{contract.client.phone}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Vendor Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building className="h-5 w-5" />
                                Vendor Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium">{contract.vendor.name}</p>
                                <p className="text-sm text-gray-300">{contract.vendor.email}</p>
                                <p className="text-sm text-gray-300">{contract.vendor.phone}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ContractShow;
