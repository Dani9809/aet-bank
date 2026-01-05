import InvestmentsClient from "@/components/admin/investments/InvestmentsClient";

export default function InvestmentsPage() {
    return (
        <div className="w-full">
            <h1 className="text-3xl font-bold font-heading track-tight mb-6">Investment Management</h1>
            <InvestmentsClient />
        </div>
    );
}
