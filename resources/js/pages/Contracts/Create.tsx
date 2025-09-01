import { Button } from '@/components/ui/button';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
export default function Create({ transaction }: { transaction?: { id: number; reference?: string } }) {
    const { url } = usePage();

    // read ?transaction_id=... from the current URL
    const transactionIdFromQuery = useMemo(() => {
        const qs = url.split('?')[1] ?? '';
        return new URLSearchParams(qs).get('transaction_id') ?? '';
    }, [url]);

    const initialTxId = useMemo(() => (transaction?.id ? String(transaction.id) : transactionIdFromQuery), [transaction?.id, transactionIdFromQuery]);

    const { data, setData, post, processing, errors, reset } = useForm<{
        transaction_id: string;
        pdf: File | null;
    }>({
        transaction_id: initialTxId,
        pdf: null,
    });

    // keep form in sync if params arrive after hydration
    useEffect(() => {
        if (!data.transaction_id && initialTxId) {
            setData('transaction_id', initialTxId);
        }
    }, [initialTxId]);

    const fileRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);

    function submit(e: React.FormEvent) {
        e.preventDefault();
        if (!data.transaction_id) {
            alert('Missing transaction_id in URL.');
            return;
        }
        if (!data.pdf) {
            alert('Please select a PDF to upload.');
            return;
        }
        post('/contracts', {
            onFinish: () => {
                reset('pdf');
            },
        });
    }

    const onFilePicked = (file: File | undefined) => {
        if (!file) return;
        if (file.type !== 'application/pdf') {
            alert('Please upload a PDF file.');
            return;
        }
        setData('pdf', file);
    };

    const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        onFilePicked(e.target.files?.[0]);
    };

    const onDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };

    const onDragLeave: React.DragEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        onFilePicked(file);
    };

    const openPicker = () => fileRef.current?.click();

    const fileLabel = data.pdf ? `${data.pdf.name} (${Intl.NumberFormat().format(data.pdf.size)} bytes)` : 'Drop PDF here or click to browse';

    return (
        <>
            <Head title="New Contract" />
            <form onSubmit={submit} className="space-y-6 p-6">
                {/* hidden input (no visible transaction field) */}
                <input type="hidden" name="transaction_id" value={data.transaction_id} />

                {/* drag & drop zone */}
                <div
                    role="button"
                    tabIndex={0}
                    onClick={openPicker}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ' ? openPicker() : null)}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    className={[
                        'flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center transition',
                        dragActive ? 'border-primary bg-muted/50' : 'border-muted-foreground/25 hover:bg-muted/50',
                        data.pdf ? 'bg-muted/40' : '',
                        'cursor-pointer',
                    ].join(' ')}
                >
                    <p className="text-sm text-muted-foreground">{fileLabel}</p>
                    <div className="flex items-center gap-3">
                        <Button type="button" variant="outline" onClick={(e) => (e.stopPropagation(), openPicker())}>
                            Choose PDF
                        </Button>
                        {data.pdf && (
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setData('pdf', null);
                                    if (fileRef.current) fileRef.current.value = '';
                                }}
                            >
                                Clear
                            </Button>
                        )}
                    </div>
                    {/* hidden file input */}
                    <input ref={fileRef} type="file" accept="application/pdf" onChange={onInputChange} className="hidden" />
                </div>

                {/* inline errors */}
                {!data.transaction_id && <p className="text-sm text-red-600">No transaction selected. Ensure the URL includes ?transaction_id=…</p>}
                {errors.transaction_id && <p className="text-sm text-red-600">{String(errors.transaction_id)}</p>}
                {errors.pdf && <p className="text-sm text-red-600">{String(errors.pdf)}</p>}

                <div className="flex gap-3">
                    <Button type="submit" disabled={processing || !data.transaction_id || !data.pdf}>
                        {processing ? 'Uploading…' : 'Create Contract'}
                    </Button>
                    <Button type="button" variant="outline" asChild>
                        <Link href="/contracts">Cancel</Link>
                    </Button>
                </div>
            </form>
        </>
    );
}
