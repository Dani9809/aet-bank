import TaxesClient from '@/components/admin/taxes/TaxesClient';

export default function TaxesPage() {
    return (
        <div className="space-y-6 max-w-[1600px] mx-auto">
            <h1 className="text-3xl font-bold font-heading track-tight mb-6">Tax Management</h1>
            <TaxesClient />
        </div>
    );
}
