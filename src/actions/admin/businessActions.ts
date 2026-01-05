'use server'

import { supabase } from '@/lib/supabase';

export type BusinessFilterParams = {
    page?: number;
    limit?: number;
    query?: string;
    type?: number | string;
    category?: number | string;
    status?: number | string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    // Ranges
    worthMin?: number;
    worthMax?: number;
    incomeMin?: number;
    incomeMax?: number;
    earningsMin?: number;
    earningsMax?: number;
    // Dates
    lastTaxCollectionFrom?: string;
    lastTaxCollectionTo?: string;
    lastMaintenanceCollectionFrom?: string;
    lastMaintenanceCollectionTo?: string;
};

export async function getBusinesses(params: BusinessFilterParams) {
    const {
        page = 1,
        limit = 25,
        query,
        type,
        category,
        status,
        sortBy = 'user_business_worth',
        sortOrder = 'desc',
        worthMin, worthMax,
        incomeMin, incomeMax,
        earningsMin, earningsMax,
        lastTaxCollectionFrom, lastTaxCollectionTo,
        lastMaintenanceCollectionFrom, lastMaintenanceCollectionTo
    } = params;

    // Use !inner on joins if we are filtering by them, otherwise normal join
    // Structure: USER_BUSINESS -> BUSINESS_TYPE_DETAIL -> (BUSINESS_TYPE, BUSINESS_CATEGORY)
    let selectQuery = `
        *,
        ACCOUNT (account_fname, account_lname, account_uname, account_email),
        BUSINESS_TYPE_DETAIL (
            business_type_id,
            BUSINESS_TYPE (business_type_name),
            BUSINESS_CATEGORY (business_category_name)
        )
    `;

    // Modify select for filtering if needed
    if ((type && type !== 'all') || (category && category !== 'all')) {
        selectQuery = `
            *,
            ACCOUNT (account_fname, account_lname, account_uname, account_email),
            BUSINESS_TYPE_DETAIL!inner (
                business_type_id,
                business_category_id,
                BUSINESS_TYPE (business_type_name),
                BUSINESS_CATEGORY (business_category_name)
            )
        `;
    }

    let dbQuery = supabase
        .from('USER_BUSINESS')
        .select(selectQuery, { count: 'exact' });

    // Filters
    if (type && type !== 'all') {
        dbQuery = dbQuery.eq('BUSINESS_TYPE_DETAIL.business_type_id', type);
    }

    if (category && category !== 'all') {
        dbQuery = dbQuery.eq('BUSINESS_TYPE_DETAIL.business_category_id', category);
    }

    if (status && status !== 'all') {
        dbQuery = dbQuery.eq('user_business_status', status);
    }

    // Range Filters
    if (worthMin !== undefined) dbQuery = dbQuery.gte('user_business_worth', worthMin);
    if (worthMax !== undefined) dbQuery = dbQuery.lte('user_business_worth', worthMax);

    if (incomeMin !== undefined) dbQuery = dbQuery.gte('user_business_monthly_income', incomeMin);
    if (incomeMax !== undefined) dbQuery = dbQuery.lte('user_business_monthly_income', incomeMax);

    if (earningsMin !== undefined) dbQuery = dbQuery.gte('user_business_earnings', earningsMin);
    if (earningsMax !== undefined) dbQuery = dbQuery.lte('user_business_earnings', earningsMax);

    // Date Filters
    if (lastTaxCollectionFrom) dbQuery = dbQuery.gte('last_tax_collection', lastTaxCollectionFrom);
    if (lastTaxCollectionTo) dbQuery = dbQuery.lte('last_tax_collection', lastTaxCollectionTo);

    if (lastMaintenanceCollectionFrom) dbQuery = dbQuery.gte('last_maintenance_collection', lastMaintenanceCollectionFrom);
    if (lastMaintenanceCollectionTo) dbQuery = dbQuery.lte('last_maintenance_collection', lastMaintenanceCollectionTo);


    // Search
    if (query) {
        dbQuery = dbQuery.or(`user_business_name.ilike.%${query}%`);
    }

    // Pagination
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    dbQuery = dbQuery.range(start, end);

    // Sort
    // Verify valid sort keys to prevent injection/errors
    const validSortKeys = [
        'user_business_id',
        'user_business_worth',
        'user_business_monthly_income',
        'user_business_earnings',
        'user_business_monthly_tax',
        'user_business_monthly_maintenance',
        'user_business_current_level',
        'last_tax_collection',
        'last_maintenance_collection'
    ];

    const sortKey = validSortKeys.includes(sortBy) ? sortBy : 'user_business_id';
    dbQuery = dbQuery.order(sortKey, { ascending: sortOrder === 'asc' });

    const { data, count, error } = await dbQuery;

    if (error) {
        console.error('Error fetching businesses:', error);
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

export async function getBusinessStats() {
    const { count, error } = await supabase
        .from('USER_BUSINESS')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error('Error fetching business stats:', error);
        return { success: false, error: error.message };
    }

    return { success: true, count };
}

export async function getBusinessCategories() {
    const { data, error } = await supabase
        .from('BUSINESS_CATEGORY')
        .select('*');

    if (error) {
        console.error('Error fetching categories:', error);
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

export async function getBusinessTypes() {
    const { data, error } = await supabase
        .from('BUSINESS_TYPE')
        .select(`
            *,
            TAX_TYPE (tax_name, tax_rate)
        `);

    if (error) {
        console.error('Error fetching types:', error);
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

export async function getTaxTypes() {
    const { data, error } = await supabase
        .from('TAX_TYPE')
        .select('*');

    if (error) {
        console.error('Error fetching tax types:', error);
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

export async function getCities() {
    const { data, error } = await supabase
        .from('CITY')
        .select('*');

    if (error) {
        console.error('Error fetching cities:', error);
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

// --- Business Categories Management ---

export async function createBusinessCategory(data: any) {
    const { error } = await supabase
        .from('BUSINESS_CATEGORY')
        .insert(data);

    if (error) {
        console.error('Error creating category:', error);
        return { success: false, error: error.message };
    }
    return { success: true };
}

export async function updateBusinessCategory(id: number, data: any) {
    const { error } = await supabase
        .from('BUSINESS_CATEGORY')
        .update(data)
        .eq('business_category_id', id);

    if (error) {
        console.error('Error updating category:', error);
        return { success: false, error: error.message };
    }
    return { success: true };
}

export async function deleteBusinessCategory(id: number) {
    const { error } = await supabase
        .from('BUSINESS_CATEGORY')
        .delete()
        .eq('business_category_id', id);

    if (error) {
        console.error('Error deleting category:', error);
        return { success: false, error: error.message };
    }
    return { success: true };
}

// --- Business Types Management ---

export async function createBusinessType(data: any) {
    const { error } = await supabase
        .from('BUSINESS_TYPE')
        .insert(data);

    if (error) {
        console.error('Error creating type:', error);
        return { success: false, error: error.message };
    }
    return { success: true };
}

export async function updateBusinessType(id: number, data: any) {
    const { error } = await supabase
        .from('BUSINESS_TYPE')
        .update(data)
        .eq('business_type_id', id);

    if (error) {
        console.error('Error updating type:', error);
        return { success: false, error: error.message };
    }
    return { success: true };
}

export async function deleteBusinessType(id: number) {
    const { error } = await supabase
        .from('BUSINESS_TYPE')
        .delete()
        .eq('business_type_id', id);

    if (error) {
        console.error('Error deleting type:', error);
        return { success: false, error: error.message };
    }
    return { success: true };
}

// --- Available Businesses (BUSINESS_TYPE_DETAIL) Management ---

export async function getBusinessTypeDetails() {
    const { data, error } = await supabase
        .from('BUSINESS_TYPE_DETAIL')
        .select(`
            *,
            BUSINESS_TYPE (business_type_name, business_type_cost, business_type_desc, business_type_monthly_earnings),
            BUSINESS_CATEGORY (business_category_name, business_category_id)
        `);

    if (error) {
        console.error('Error fetching details:', error);
        return { success: false, error: error.message };
    }
    return { success: true, data };
}

export async function createBusinessTypeDetail(data: any) {
    const { error } = await supabase
        .from('BUSINESS_TYPE_DETAIL')
        .insert(data);

    if (error) {
        console.error('Error creating available business:', error);
        return { success: false, error: error.message };
    }
    return { success: true };
}

export async function updateBusinessTypeDetail(id: number, data: any) {
    const { error } = await supabase
        .from('BUSINESS_TYPE_DETAIL')
        .update(data)
        .eq('business_type_detail_id', id);

    if (error) {
        console.error('Error updating available business:', error);
        return { success: false, error: error.message };
    }
    return { success: true };
}

export async function deleteBusinessTypeDetail(id: number) {
    const { error } = await supabase
        .from('BUSINESS_TYPE_DETAIL')
        .delete()
        .eq('business_type_detail_id', id);

    if (error) {
        console.error('Error deleting available business:', error);
        return { success: false, error: error.message };
    }
    return { success: true };
}

// --- User Business Management ---

export async function updateUserBusiness(id: number, data: any) {
    const { error } = await supabase
        .from('USER_BUSINESS')
        .update(data)
        .eq('user_business_id', id);

    if (error) {
        console.error('Error updating user business:', error);
        return { success: false, error: error.message };
    }
    return { success: true };
}
