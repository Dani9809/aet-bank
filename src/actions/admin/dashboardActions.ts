'use server'

import { supabase } from '@/lib/supabase';
import { getAdminSession } from '@/actions/adminActions';

export interface DashboardStats {
    accounts: { count: number; growth: number };
    businesses: { count: number; growth: number };
    assets: { count: number; growth: number };
    investments: { count: number; growth: number };
}

async function getGrowthStats(table: string, timestampCol: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    // 1. Get Total Count
    const { count: totalCount, error: totalError } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

    if (totalError) {
        console.error(`Error fetching total for ${table}:`, totalError);
        return { count: 0, growth: 0 };
    }

    // 2. Get Count Before Start of Month (to calculate growth relative to start of month)
    const { count: prevCount, error: prevError } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
        .lt(timestampCol, startOfMonth);

    if (prevError) {
        console.error(`Error fetching prev count for ${table}:`, prevError);
        return { count: totalCount || 0, growth: 0 };
    }

    const current = totalCount || 0;
    const previous = prevCount || 0;

    let growth = 0;
    if (previous > 0) {
        growth = ((current - previous) / previous) * 100;
    } else if (current > 0) {
        growth = 100; // If undefined previous but we have current, strictly it's 100% new
    }

    return { count: current, growth };
}

export async function getDashboardData() {
    const userId = await getAdminSession();

    // Fetch admin details
    const { data: admin } = await supabase
        .from('ACCOUNT')
        .select('account_fname, account_lname')
        .eq('account_id', userId!)
        .single();

    // Fetch Stats in Parallel
    const [accounts, businesses, assets, investments] = await Promise.all([
        getGrowthStats('ACCOUNT', 'created_at'),
        getGrowthStats('USER_BUSINESS', 'created_at'),
        getGrowthStats('USER_ASSET', 'created_at'),
        getGrowthStats('USER_INVESTMENT', 'user_investment_issued')
    ]);

    // Time-based greeting
    const currentHour = new Date().getHours();
    const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';

    return {
        admin,
        greeting,
        stats: {
            accounts,
            businesses,
            assets,
            investments
        }
    };
}
