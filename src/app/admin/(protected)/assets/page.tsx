import AssetsClient from "@/components/admin/assets/AssetsClient";

export default function AdminAssetsPage() {
    return (
        <div className="w-full">
            <h1 className="text-3xl font-bold font-heading track-tight mb-6">Asset Management</h1>
            <AssetsClient />
        </div>
    );
}
