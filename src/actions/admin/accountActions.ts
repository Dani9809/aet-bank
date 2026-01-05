'use server'

import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

export type AccountFilterParams = {
    page?: number;
    limit?: number;
    query?: string;
    type?: number | string;
    status?: number | string;
    excludeId?: number;
    // Ranges
    clicksMin?: number;
    clicksMax?: number;
    investEarningsMin?: number;
    investEarningsMax?: number;
    bizEarningsMin?: number;
    bizEarningsMax?: number;
    clickerEarningsMin?: number;
    clickerEarningsMax?: number;
};

export async function getAccounts(params: AccountFilterParams) {
    const {
        page = 1,
        limit = 25,
        query,
        type,
        status,
        excludeId,
        clicksMin, clicksMax,
        investEarningsMin, investEarningsMax,
        bizEarningsMin, bizEarningsMax,
        clickerEarningsMin, clickerEarningsMax
    } = params;

    let dbQuery = supabase
        .from('ACCOUNT')
        .select('*, TYPE(type_name)', { count: 'exact' });

    // Exclusion
    if (excludeId) {
        dbQuery = dbQuery.neq('account_id', excludeId);
    }

    // Filters
    if (type && type !== 'all') {
        dbQuery = dbQuery.eq('type_id', type);
    }

    if (status && status !== 'all') {
        dbQuery = dbQuery.eq('account_status', status);
    }

    // Range Filters
    if (clicksMin !== undefined) dbQuery = dbQuery.gte('account_total_clicks', clicksMin);
    if (clicksMax !== undefined) dbQuery = dbQuery.lte('account_total_clicks', clicksMax);

    if (investEarningsMin !== undefined) dbQuery = dbQuery.gte('account_investment_total_earnings', investEarningsMin);
    if (investEarningsMax !== undefined) dbQuery = dbQuery.lte('account_investment_total_earnings', investEarningsMax);

    if (bizEarningsMin !== undefined) dbQuery = dbQuery.gte('account_business_total_earnings', bizEarningsMin);
    if (bizEarningsMax !== undefined) dbQuery = dbQuery.lte('account_business_total_earnings', bizEarningsMax);

    if (clickerEarningsMin !== undefined) dbQuery = dbQuery.gte('account_clicker_total_earnings', clickerEarningsMin);
    if (clickerEarningsMax !== undefined) dbQuery = dbQuery.lte('account_clicker_total_earnings', clickerEarningsMax);


    // Search
    if (query) {
        // ILIKE for case-insensitive search on text fields
        dbQuery = dbQuery.or(`account_uname.ilike.%${query}%,account_email.ilike.%${query}%,account_fname.ilike.%${query}%,account_lname.ilike.%${query}%`);
    }

    // Pagination
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    dbQuery = dbQuery.range(start, end);
    dbQuery = dbQuery.order('account_id', { ascending: false }); // Default sort by newest

    const { data, count, error } = await dbQuery;

    if (error) {
        console.error('Error fetching accounts:', error);
        return { success: false, error: error.message };
    }

    const totalPages = count ? Math.ceil(count / limit) : 0;

    return {
        success: true,
        data: data,
        meta: {
            total: count,
            page,
            limit,
            totalPages
        }
    };
}

export async function getAccountDetails(accountId: number) {
    const { data, error } = await supabase
        .from('ACCOUNT')
        .select('*')
        .eq('account_id', accountId)
        .single();

    if (error) {
        console.error('Error fetching account details:', error);
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

// Update account profile fields (admin override)
export async function updateAccountProfile(
    accountId: number,
    data: {
        account_fname: string;
        account_mname?: string;
        account_lname: string;
        account_email: string;
        account_uname: string;
        account_address?: string;
    }
) {
    const { error } = await supabase
        .from('ACCOUNT')
        .update({
            account_fname: data.account_fname,
            account_mname: data.account_mname || null,
            account_lname: data.account_lname,
            account_email: data.account_email,
            account_uname: data.account_uname,
            account_address: data.account_address || null,
        })
        .eq('account_id', accountId);

    if (error) {
        console.error('Error updating account profile:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}


// Update username (admin override)
export async function updateAccountUsername(accountId: number, newUsername: string) {
    if (!newUsername || newUsername.trim().length < 3) {
        return { success: false, error: 'Username must be at least 3 characters' };
    }

    const { data: existing } = await supabase
        .from('ACCOUNT')
        .select('account_id')
        .eq('account_uname', newUsername)
        .neq('account_id', accountId)
        .single();

    if (existing) {
        return { success: false, error: 'Username already taken' };
    }

    const { error } = await supabase
        .from('ACCOUNT')
        .update({ account_uname: newUsername })
        .eq('account_id', accountId);

    if (error) {
        console.error('Error updating username:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

// Update password (admin override)
export async function updateAccountPassword(accountId: number, newPassword: string) {
    // Import bcrypt dynamically to avoid issues
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    const { error } = await supabase
        .from('ACCOUNT')
        .update({ account_pword: hashedPassword })
        .eq('account_id', accountId);

    if (error) {
        console.error('Error updating password:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

// Update PIN (admin override)
export async function updateAccountPin(accountId: number, newPin: string) {
    if (newPin.length !== 6 || !/^\d+$/.test(newPin)) {
        return { success: false, error: 'PIN must be exactly 6 digits' };
    }

    const bcrypt = await import('bcryptjs');
    const hashedPin = await bcrypt.hash(newPin, 12);

    const { error } = await supabase
        .from('ACCOUNT')
        .update({ account_pin: hashedPin })
        .eq('account_id', accountId);

    if (error) {
        console.error('Error updating PIN:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

// Update account status (admin override)
export async function updateAccountStatus(accountId: number, newStatus: number) {
    const { error } = await supabase
        .from('ACCOUNT')
        .update({ account_status: newStatus })
        .eq('account_id', accountId);

    if (error) {
        console.error('Error updating account status:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

// Update account type (admin override)
export async function updateAccountType(accountId: number, newTypeId: number) {
    const { error } = await supabase
        .from('ACCOUNT')
        .update({ type_id: newTypeId })
        .eq('account_id', accountId);

    if (error) {
        console.error('Error updating account type:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

export async function getAccountStatuses() {
    const { data, error } = await supabase
        .from('ACCOUNT')
        .select('account_status');

    if (error) {
        console.error('Error fetching statuses:', error);
        return { success: false, error: error.message };
    }

    // Get unique statuses
    const statuses = Array.from(new Set(data.map(item => item.account_status))).sort((a, b) => b - a);

    return { success: true, data: statuses };
}

// Delete Admin Account (Recursive/Safe)
export async function deleteAdminAccount(accountId: number) {
    const cookieStore = await cookies();

    // 1. Delete related data (Manual Cascade if needed, though DB cascade is better)
    // Assuming DB has cascade on delete, but to be safe and clear:

    // Delete from related tables (Optional explicit cleanup)
    // await supabase.from('TRANSACTION').delete().eq('account_id', accountId);
    // await supabase.from('INVOICE').delete().eq('account_id', accountId);
    // ... others

    // 2. Delete the account
    const { error } = await supabase
        .from('ACCOUNT')
        .delete()
        .eq('account_id', accountId);

    if (error) {
        console.error('Error deleting account:', error);
        return { success: false, error: error.message };
    }

    // 3. Clear session
    cookieStore.delete('admin_session');

    return { success: true };
}
