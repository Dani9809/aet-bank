'use server'

import { supabase } from '@/lib/supabase';

export type AccountType = {
    type_id: number;
    type_name: string;
    type_desc?: string;
    type_max_stage?: number;
    status?: number;
    created_at?: string;
};

// Fetch all account types
export async function getAccountTypes() {
    const { data, error } = await supabase
        .from('TYPE')
        .select('*')
        .order('type_id', { ascending: true });

    if (error) {
        console.error('Error fetching account types:', error);
        return { success: false, error: error.message };
    }

    return { success: true, data: data as AccountType[] };
}

// Add a new account type
export async function addAccountType(
    typeName: string,
    typeId?: number,
    typeDesc?: string,
    typeMaxStage?: number,
    typeStatus?: number
) {
    if (!typeName || typeName.trim() === '') {
        return { success: false, error: 'Type name is required' };
    }

    // Check if type already exists (by name or ID)
    let query = supabase
        .from('TYPE')
        .select('type_id')
        .ilike('type_name', typeName);

    if (typeId) {
        // If ID provided, check if that ID exists too
        query = query.or(`type_id.eq.${typeId},type_name.ilike.${typeName}`);
    }

    const { data: existing } = await query;

    if (existing && existing.length > 0) {
        return { success: false, error: 'Account type with this name or ID already exists' };
    }

    const payload: any = { type_name: typeName.trim() };
    if (typeId) payload.type_id = typeId;
    if (typeDesc) payload.type_desc = typeDesc;
    if (typeMaxStage !== undefined) payload.type_max_stage = typeMaxStage;
    if (typeStatus !== undefined) payload.status = typeStatus;

    const { data, error } = await supabase
        .from('TYPE')
        .insert([payload])
        .select()
        .single();

    if (error) {
        console.error('Error adding account type:', error);
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

// Delete account type (optional, but good to have / basic CRUD)
export async function deleteAccountType(typeId: number) {
    const { error } = await supabase
        .from('TYPE')
        .delete()
        .eq('type_id', typeId);

    if (error) {
        console.error('Error deleting account type:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}
// Update account type details
export async function updateAccountTypeDetails(
    typeId: number,
    data: {
        typeName: string;
        typeDesc?: string;
        typeMaxStage?: number;
        status?: number;
    }
) {
    if (!data.typeName || data.typeName.trim() === '') {
        return { success: false, error: 'Type name is required' };
    }

    // Check for name uniqueness if name is changing (optional, but good practice)
    // For now, assuming basic update

    const payload: any = {
        type_name: data.typeName.trim(),
        type_desc: data.typeDesc,
        type_max_stage: data.typeMaxStage,
        status: data.status
    };

    const { error } = await supabase
        .from('TYPE')
        .update(payload)
        .eq('type_id', typeId);

    if (error) {
        console.error('Error updating account type:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}
