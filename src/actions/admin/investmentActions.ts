'use server'

import { supabase } from '@/lib/supabase';

export type InvestmentFilterParams = {
    page?: number;
    limit?: number;
    query?: string;
    type?: number | string;
    category?: number | string;
    focus?: string;
    priceFrom?: number;
    priceTo?: number;
    capitalizationFrom?: number;
    capitalizationTo?: number;
    status?: number | string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
};

// --- User Investments ---

export async function getUserInvestments(params: InvestmentFilterParams) {
    const {
        page = 1,
        limit = 25,
        query,
        type,
        category,
        focus,
        priceFrom,
        priceTo,
        capitalizationFrom,
        capitalizationTo,
        status,
        sortBy = 'user_investment_id',
        sortOrder = 'desc',
    } = params;

    // Base Query
    // We need to join:
    // USER_INVESTMENT -> ACCOUNT
    // USER_INVESTMENT -> INVESTMENT_TYPE_DETAIL -> INVESTMENT_TYPE
    // USER_INVESTMENT -> INVESTMENT_TYPE_DETAIL -> INVESTMENT_CATEGORY

    // Note: Use !inner for ACCOUNT to allow filtering by its columns
    let selectQuery = `
        *,
        ACCOUNT!inner (account_fname, account_lname, account_uname, account_email),
        INVESTMENT_TYPE_DETAIL (
            *,
            INVESTMENT_TYPE (
                investment_type_name,
                investment_type_price_per_unit,
                investment_type_capitalization,
                investment_type_status
            ),
            INVESTMENT_CATEGORY (
                investment_category_name,
                investment_category_focus
            )
        )
    `;

    let dbQuery = supabase
        .from('USER_INVESTMENT')
        .select(selectQuery, { count: 'exact' });

    // --- Filters ---

    // 1. Investment Type Name (via INVESTMENT_TYPE_DETAIL -> INVESTMENT_TYPE)
    if (type && type !== 'all') {
        dbQuery = dbQuery.eq('INVESTMENT_TYPE_DETAIL.INVESTMENT_TYPE.investment_type_id', type);
    }

    // 2. Category Name (via INVESTMENT_TYPE_DETAIL -> INVESTMENT_CATEGORY)
    if (category && category !== 'all') {
        dbQuery = dbQuery.eq('INVESTMENT_TYPE_DETAIL.INVESTMENT_CATEGORY.investment_category_id', category);
    }

    // 3. Focus (text)
    if (focus && focus !== 'all') {
        dbQuery = dbQuery.ilike('INVESTMENT_TYPE_DETAIL.INVESTMENT_CATEGORY.investment_category_focus', `%${focus}%`);
    }

    // 4. Price Per Unit (via INVESTMENT_TYPE)
    if (priceFrom) {
        dbQuery = dbQuery.gte('INVESTMENT_TYPE_DETAIL.INVESTMENT_TYPE.investment_type_price_per_unit', priceFrom);
    }
    if (priceTo) {
        dbQuery = dbQuery.lte('INVESTMENT_TYPE_DETAIL.INVESTMENT_TYPE.investment_type_price_per_unit', priceTo);
    }

    // 5. Capitalization (via INVESTMENT_TYPE)
    if (capitalizationFrom) {
        dbQuery = dbQuery.gte('INVESTMENT_TYPE_DETAIL.INVESTMENT_TYPE.investment_type_capitalization', capitalizationFrom);
    }
    if (capitalizationTo) {
        dbQuery = dbQuery.lte('INVESTMENT_TYPE_DETAIL.INVESTMENT_TYPE.investment_type_capitalization', capitalizationTo);
    }

    // 6. Type Status (via INVESTMENT_TYPE)
    if (status && status !== 'all') {
        dbQuery = dbQuery.eq('INVESTMENT_TYPE_DETAIL.INVESTMENT_TYPE.investment_type_status', status);
    }

    // Global Search (User Name)
    if (query) {
        // Filter by ACCOUNT.account_uname
        // Since we used ACCOUNT!inner, we can filter on it directly via the embedded resource syntax or dot notation if supported.
        // Supabase JS v2 usually supports filtering on joined tables using the dot notation if !inner is used.
        dbQuery = dbQuery.ilike('ACCOUNT.account_uname', `%${query}%`);
    }

    // Pagination
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    dbQuery = dbQuery.range(start, end);

    // Sort
    // Sorting by nested column is also tricky. Defaults to ID.
    dbQuery = dbQuery.order(sortBy, { ascending: sortOrder === 'asc' });

    const { data, count, error } = await dbQuery;

    if (error) {
        console.error('Error fetching user investments:', error);
        return { success: false, error: error.message };
    }

    const totalPages = count ? Math.ceil(count / limit) : 0;

    return {
        success: true,
        data,
        meta: {
            total: count,
            page,
            limit,
            totalPages
        }
    };
}

// --- Investment Stats ---

export async function getInvestmentStats() {
    // Total count from USER_INVESTMENT
    const { count, error } = await supabase
        .from('USER_INVESTMENT')
        .select('*', { count: 'exact', head: true });

    if (error) {
        return { success: false, error: error.message };
    }
    return { success: true, count };
}

// --- Investment Categories ---

export async function getInvestmentCategories() {
    const { data, error } = await supabase
        .from('INVESTMENT_CATEGORY')
        .select('*')
        .order('investment_category_id', { ascending: true });

    if (error) return { success: false, error: error.message };
    return { success: true, data };
}

export async function createInvestmentCategory(data: any) {
    const { error } = await supabase.from('INVESTMENT_CATEGORY').insert(data);
    if (error) return { success: false, error: error.message };
    return { success: true };
}

export async function updateInvestmentCategory(id: number, data: any) {
    const { error } = await supabase.from('INVESTMENT_CATEGORY').update(data).eq('investment_category_id', id);
    if (error) return { success: false, error: error.message };
    return { success: true };
}

export async function deleteInvestmentCategory(id: number) {
    const { error } = await supabase.from('INVESTMENT_CATEGORY').delete().eq('investment_category_id', id);
    if (error) return { success: false, error: error.message };
    return { success: true };
}

// --- Investment Types ---

export async function getInvestmentTypes() {
    const { data, error } = await supabase
        .from('INVESTMENT_TYPE')
        .select('*')
        .order('investment_type_id', { ascending: true });

    if (error) return { success: false, error: error.message };
    return { success: true, data };
}

export async function createInvestmentType(data: any) {
    const { error } = await supabase.from('INVESTMENT_TYPE').insert(data);
    if (error) return { success: false, error: error.message };
    return { success: true };
}

export async function updateInvestmentType(id: number, data: any) {
    const { error } = await supabase.from('INVESTMENT_TYPE').update(data).eq('investment_type_id', id);
    if (error) return { success: false, error: error.message };
    return { success: true };
}

export async function deleteInvestmentType(id: number) {
    const { error } = await supabase.from('INVESTMENT_TYPE').delete().eq('investment_type_id', id);
    if (error) return { success: false, error: error.message };
    return { success: true };
}

// --- Investment Type Details (Available Investments) ---

export async function getInvestmentTypeDetails() {
    const { data, error } = await supabase
        .from('INVESTMENT_TYPE_DETAIL')
        .select(`
            *,
            INVESTMENT_TYPE (investment_type_name),
            INVESTMENT_CATEGORY (investment_category_name)
        `)
        .order('investment_type_detail_id', { ascending: true });

    if (error) return { success: false, error: error.message };
    return { success: true, data };
}

export async function createInvestmentTypeDetail(data: any) {
    const { error } = await supabase.from('INVESTMENT_TYPE_DETAIL').insert(data);
    if (error) return { success: false, error: error.message };
    return { success: true };
}

export async function updateInvestmentTypeDetail(id: number, data: any) {
    const { error } = await supabase.from('INVESTMENT_TYPE_DETAIL').update(data).eq('investment_type_detail_id', id);
    if (error) return { success: false, error: error.message };
    return { success: true };
}

export async function deleteInvestmentTypeDetail(id: number) {
    const { error } = await supabase.from('INVESTMENT_TYPE_DETAIL').delete().eq('investment_type_detail_id', id);
    if (error) return { success: false, error: error.message };
    return { success: true };
}
