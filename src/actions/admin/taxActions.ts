'use server'

import { supabase } from '@/lib/supabase';

// Defining type locally since it's missing from database.types.ts
export type TaxType = {
    tax_type_id: number;
    tax_name: string;
    tax_rate: number;
    is_auto: boolean;
};

export type TaxFilterParams = {
    page?: number;
    limit?: number;
    query?: string;
    rateFrom?: number;
    rateTo?: number;
    isAuto?: string; // "true", "false", or "all"
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
};

export async function getTaxTypes(params: TaxFilterParams) {
    const {
        page = 1,
        limit = 25,
        query,
        rateFrom,
        rateTo,
        isAuto,
        sortBy = 'tax_type_id',
        sortOrder = 'asc', // Default asc for IDs usually
    } = params;

    let dbQuery = supabase
        .from('TAX_TYPE')
        .select('*', { count: 'exact' });

    // --- Filters ---

    // 1. Global Search (Name)
    if (query) {
        dbQuery = dbQuery.ilike('tax_name', `%${query}%`);
    }

    // 2. Tax Rate Range
    if (rateFrom !== undefined && rateFrom !== null) {
        dbQuery = dbQuery.gte('tax_rate', rateFrom);
    }
    if (rateTo !== undefined && rateTo !== null) {
        dbQuery = dbQuery.lte('tax_rate', rateTo);
    }

    // 3. Is Auto
    if (isAuto && isAuto !== 'all') {
        const boolValue = isAuto === 'true';
        dbQuery = dbQuery.eq('is_auto', boolValue);
    }

    // Pagination
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    dbQuery = dbQuery.range(start, end);

    // Sort
    dbQuery = dbQuery.order(sortBy, { ascending: sortOrder === 'asc' });

    const { data, count, error } = await dbQuery;

    if (error) {
        console.error('Error fetching tax types:', error);
        return { success: false, error: error.message };
    }

    const totalPages = count ? Math.ceil(count / limit) : 0;

    return {
        success: true,
        data: data as TaxType[],
        meta: {
            total: count,
            page,
            limit,
            totalPages
        }
    };
}

export async function getTaxTypeStats() {
    const { count, error } = await supabase
        .from('TAX_TYPE')
        .select('*', { count: 'exact', head: true });

    if (error) {
        return { success: false, error: error.message };
    }
    return { success: true, count };
}

export async function createTaxType(data: Partial<TaxType>) {
    // If tax_type_id is provided, include it, otherwise let DB generate    
    const { error } = await supabase.from('TAX_TYPE').insert(data);
    if (error) return { success: false, error: error.message };
    return { success: true };
}

export async function updateTaxType(id: number, data: Partial<TaxType>) {
    const { error } = await supabase.from('TAX_TYPE').update(data).eq('tax_type_id', id);
    if (error) return { success: false, error: error.message };
    return { success: true };
}

export async function deleteTaxType(id: number) {
    const { error } = await supabase.from('TAX_TYPE').delete().eq('tax_type_id', id);
    if (error) return { success: false, error: error.message };
    return { success: true };
}
