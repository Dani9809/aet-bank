import { getAdminSession } from "@/actions/adminActions";
import AccountsClient from "@/components/admin/accounts/AccountsClient";

export default async function AdminAccountsPage() {
    const userId = await getAdminSession();

    // Layout handles redirect if not logged in, but we need userId for the client component
    // If layout lets us through, userId should exist (or we handle null in client or throw)

    return (
        <div className="w-full">
            <h1 className="text-3xl font-bold font-heading track-tight mb-6">Accounts Management</h1>
            <AccountsClient currentUserId={userId!} />
        </div>
    );
}
