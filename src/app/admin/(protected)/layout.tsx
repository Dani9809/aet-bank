import AdminSidebar from "@/components/admin/AdminSidebar";
import { getAdminSession } from "@/actions/adminActions";
import { redirect } from "next/navigation";

export default async function AdminProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const userId = await getAdminSession();

    if (!userId) {
        redirect("/admin");
    }

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden font-body">
            <AdminSidebar />
            <main className="flex-1 overflow-y-auto w-full relative">
                {/* Background similar to login for consistency */}
                <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-40">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[120px]" />
                </div>

                <div className="relative z-10 p-4 md:p-8 pb-24 md:pb-8 max-w-7xl mx-auto space-y-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
