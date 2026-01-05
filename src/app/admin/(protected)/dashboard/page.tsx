import { getDashboardData } from "@/actions/admin/dashboardActions";
import { formatDashboardStats } from "./dashboardUtils";
import DashboardHeader from "./_components/DashboardHeader";
import DashboardStats from "./_components/DashboardStats";
import DashboardQuickActions from "./_components/DashboardQuickActions";
import DashboardSystemStatus from "./_components/DashboardSystemStatus";

export default async function AdminDashboardPage() {
    const { admin, greeting, stats } = await getDashboardData();
    const formattedStats = formatDashboardStats(stats);

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-heading track-tight mb-2">Dashboard</h1>
            </div>
            <DashboardHeader
                greeting={greeting}
                adminName={`${admin?.account_fname} ${admin?.account_lname}`}
            />

            <DashboardStats stats={formattedStats} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <DashboardQuickActions />
                <DashboardSystemStatus />
            </div>
        </div>
    );
}
