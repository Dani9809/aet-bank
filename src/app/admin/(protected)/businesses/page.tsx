
import BusinessesClient from "@/components/admin/businesses/BusinessesClient";

export default function AdminBusinessesPage() {
    return (
        <div className="w-full">
            <h1 className="text-3xl font-bold font-heading track-tight mb-6">Business Management</h1>
            <BusinessesClient />
        </div>
    );
}
