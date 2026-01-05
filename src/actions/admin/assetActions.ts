'use server'

import { supabase } from '@/lib/supabase';

export type AssetFilterParams = {
    page?: number;
    limit?: number;
    query?: string;
    type?: number | string;
    category?: number | string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    lastTaxCollectionFrom?: string;
    lastTaxCollectionTo?: string;
    lastMaintenancePaidFrom?: string;
    lastMaintenancePaidTo?: string;
};

export async function getAssets(params: AssetFilterParams) {
    const {
        page = 1,
        limit = 25,
        query,
        type,
        category,
        sortBy = 'user_asset_id',
        sortOrder = 'desc',
        lastTaxCollectionFrom,
        lastTaxCollectionTo,
        lastMaintenancePaidFrom,
        lastMaintenancePaidTo
    } = params;

    // Structure: USER_ASSET -> ASSET (1:1) -> ASSET_DETAIL (1:many) / ASSET_TYPE
    // Updated Schema: USER_ASSET has asset_id (FK to ASSET)
    let selectQuery = `
        *,
        ACCOUNT (account_fname, account_lname, account_uname, account_email),
        ASSET (
            *,
            TAX_TYPE (
                tax_name,
                tax_rate
            ),
            ASSET_TYPE (
                asset_type_name,
                ASSET_CATEGORY (asset_category_name)
            ),
            ASSET_DETAIL (
                detail_id,
                DETAIL (
                    detail_label,
                    detail
                )
            )
        )
    `;

    // Modify select for filtering if needed
    if ((type && type !== 'all') || (category && category !== 'all')) {
        selectQuery = `
            *,
            ACCOUNT (account_fname, account_lname, account_uname, account_email),
            ASSET!inner (
                *,
                TAX_TYPE (
                    tax_name,
                    tax_rate
                ),
                ASSET_TYPE!inner (
                    asset_type_name,
                    ASSET_CATEGORY (asset_category_name)
                ),
                ASSET_DETAIL (
                    detail_id,
                    DETAIL (
                        detail_label,
                        detail
                    )
                )
            )
        `;
    }

    let dbQuery = supabase
        .from('USER_ASSET')
        .select(selectQuery, { count: 'exact' });

    // Filters
    if (type && type !== 'all') {
        dbQuery = dbQuery.eq('ASSET.asset_type_id', type);
    }

    if (category && category !== 'all') {
        dbQuery = dbQuery.eq('ASSET.ASSET_TYPE.asset_category_id', category);
    }

    // Date Range Filters
    if (lastTaxCollectionFrom) {
        dbQuery = dbQuery.gte('last_tax_collection', lastTaxCollectionFrom);
    }
    if (lastTaxCollectionTo) {
        dbQuery = dbQuery.lte('last_tax_collection', lastTaxCollectionTo);
    }

    if (lastMaintenancePaidFrom) {
        dbQuery = dbQuery.gte('last_maintenance_paid', lastMaintenancePaidFrom);
    }
    if (lastMaintenancePaidTo) {
        dbQuery = dbQuery.lte('last_maintenance_paid', lastMaintenancePaidTo);
    }

    // Search
    if (query) {
        dbQuery = dbQuery.ilike('user_asset_custom_name', `%${query}%`);
    }

    // Pagination
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    dbQuery = dbQuery.range(start, end);

    // Sort
    const validSortKeys = [
        'user_asset_id',
        'created_at',
        'user_asset_custom_name',
        'user_asset_monthly_tax',
        'user_asset_monthly_maintenance',
        'user_asset_market_value'
    ];

    const sortKey = validSortKeys.includes(sortBy) ? sortBy : 'user_asset_id';
    dbQuery = dbQuery.order(sortKey, { ascending: sortOrder === 'asc' });

    const { data, count, error } = await dbQuery;

    if (error) {
        console.error('Error fetching assets:', error);
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

export async function getAssetStats() {
    const { count, error } = await supabase
        .from('USER_ASSET')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error('Error fetching asset stats:', error);
        return { success: false, error: error.message };
    }

    return { success: true, count };
}

export async function getAssetCategories() {
    const { data, error } = await supabase
        .from('ASSET_CATEGORY')
        .select('*');

    if (error) {
        console.error('Error fetching categories:', error);
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

export async function getAssetTypes() {
    const { data, error } = await supabase
        .from('ASSET_TYPE')
        .select('*');

    if (error) {
        console.error('Error fetching types:', error);
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

// --- Asset Categories Management ---

export async function createAssetCategory(data: any) {
    const { error } = await supabase
        .from('ASSET_CATEGORY')
        .insert(data);

    if (error) {
        console.error('Error creating category:', error);
        return { success: false, error: error.message };
    }
    return { success: true };
}

export async function updateAssetCategory(id: number, data: any) {
    const { error } = await supabase
        .from('ASSET_CATEGORY')
        .update(data)
        .eq('asset_category_id', id);

    if (error) {
        console.error('Error updating category:', error);
        return { success: false, error: error.message };
    }
    return { success: true };
}

export async function deleteAssetCategory(id: number) {
    const { error } = await supabase
        .from('ASSET_CATEGORY')
        .delete()
        .eq('asset_category_id', id);

    if (error) {
        console.error('Error deleting category:', error);
        return { success: false, error: error.message };
    }
    return { success: true };
}

// --- Asset Types Management ---

export async function createAssetType(data: any) {
    const { error } = await supabase
        .from('ASSET_TYPE')
        .insert(data);

    if (error) {
        console.error('Error creating type:', error);
        return { success: false, error: error.message };
    }
    return { success: true };
}

export async function updateAssetType(id: number, data: any) {
    const { error } = await supabase
        .from('ASSET_TYPE')
        .update(data)
        .eq('asset_type_id', id);

    if (error) {
        console.error('Error updating type:', error);
        return { success: false, error: error.message };
    }
    return { success: true };
}

export async function deleteAssetType(id: number) {
    const { error } = await supabase
        .from('ASSET_TYPE')
        .delete()
        .eq('asset_type_id', id);

    if (error) {
        console.error('Error deleting type:', error);
        return { success: false, error: error.message };
    }
    return { success: true };
}

export async function getTaxTypes() {
    const { data, error } = await supabase
        .from('TAX_TYPE' as any)
        .select('*');

    if (error) {
        console.error('Error fetching tax types:', error);
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

// --- Available Assets (ASSET table) Management ---

export async function getAvailableAssets() {
    const { data, error } = await supabase
        .from('ASSET')
        .select(`
            *,
            ASSET_TYPE (
                asset_type_name,
                ASSET_CATEGORY (asset_category_name)
            ),
            ASSET_DETAIL (
                asset_detail_id,
                detail_id,
                DETAIL (
                    detail_label,
                    detail
                )
            )
        `);

    if (error) {
        console.error('Error fetching available assets:', error);
        return { success: false, error: error.message };
    }
    return { success: true, data };
}

export async function createAvailableAsset(data: any) {
    const { details, ...assetData } = data;

    const { data: asset, error: assetError } = await supabase
        .from('ASSET')
        .insert(assetData)
        .select()
        .single();

    if (assetError) {
        console.error('Error creating asset:', assetError);
        return { success: false, error: assetError.message };
    }

    if (details && Array.isArray(details) && details.length > 0) {
        const assetId = asset.asset_id;

        for (const item of details) {
            if (!item.label || !item.value) continue;

            // Always Create DETAIL (Private Model)
            const { data: newDetail, error: detailError } = await supabase
                .from('DETAIL')
                .insert({ detail_label: item.label, detail: item.value })
                .select('detail_id')
                .single();

            if (detailError) {
                console.error('Error creating detail:', detailError);
                continue;
            }

            const detailId = newDetail.detail_id;

            // Link in ASSET_DETAIL
            const { error: linkError } = await supabase
                .from('ASSET_DETAIL')
                .insert({ asset_id: assetId, detail_id: detailId });

            if (linkError) {
                console.error('Error linking detail:', linkError);
            }
        }
    }

    return { success: true };
}

export async function updateAvailableAsset(id: number, data: any) {
    const { details, ...assetData } = data;

    // 1. Update ASSET
    const { error: assetError } = await supabase
        .from('ASSET')
        .update(assetData)
        .eq('asset_id', id);

    if (assetError) {
        console.error('Error updating asset:', assetError);
        return { success: false, error: assetError.message };
    }

    // 2. Update Details (Mutable / Private Model)
    if (details && Array.isArray(details)) {
        // Fetch current ASSET_DETAILs to identify deletions
        const { data: currentDetails, error: fetchError } = await supabase
            .from('ASSET_DETAIL')
            .select('asset_detail_id, detail_id')
            .eq('asset_id', id);

        if (fetchError) {
            console.error('Error fetching current details:', fetchError);
            return { success: false, error: fetchError.message };
        }

        const currentMap = new Map(currentDetails?.map(d => [d.asset_detail_id, d.detail_id]));
        const incomingIds = details
            .filter((d: any) => d.asset_detail_id)
            .map((d: any) => d.asset_detail_id);

        // Identify IDs to delete
        const idsToDelete = Array.from(currentMap.keys()).filter(cid => !incomingIds.includes(cid));

        // Process Updates and Creates
        for (const item of details) {
            if (!item.label || !item.value) continue;

            try {
                if (item.asset_detail_id && currentMap.has(item.asset_detail_id)) {
                    // UPDATE Existing Detail in-place
                    const detailId = currentMap.get(item.asset_detail_id);
                    if (detailId) {
                        const { error: updateError } = await supabase
                            .from('DETAIL')
                            .update({ detail_label: item.label, detail: item.value })
                            .eq('detail_id', detailId);

                        if (updateError) console.error('Error updating detail:', updateError);
                    }
                } else {
                    // INSERT New Detail (and Link)
                    const { data: newDetail, error: createError } = await supabase
                        .from('DETAIL')
                        .insert({ detail_label: item.label, detail: item.value })
                        .select('detail_id')
                        .single();

                    if (createError) throw createError;

                    const { error: linkError } = await supabase
                        .from('ASSET_DETAIL')
                        .insert({ asset_id: id, detail_id: newDetail.detail_id });

                    if (linkError) console.error('Error linking new detail:', linkError);
                }
            } catch (err) {
                console.error('Error processing detail:', err);
            }
        }

        // Process Deletes (Clean up ASSET_DETAIL and the DETAIL itself)
        if (idsToDelete.length > 0) {
            // Get detail_ids before deleting links
            const detailIdsToDelete = idsToDelete
                .map(adid => currentMap.get(adid))
                .filter(did => did !== undefined) as number[];

            // Delete Links
            const { error: deleteLinkError } = await supabase
                .from('ASSET_DETAIL')
                .delete()
                .in('asset_detail_id', idsToDelete);

            if (deleteLinkError) {
                console.error('Error deleting asset details:', deleteLinkError);
            } else {
                // Delete Orphans (Details)
                // Note: If other assets utilize these details, this might fail or cause side effects.
                // Assuming Private Model where details are NOT shared.
                if (detailIdsToDelete.length > 0) {
                    const { error: deleteDetailError } = await supabase
                        .from('DETAIL')
                        .delete()
                        .in('detail_id', detailIdsToDelete);

                    if (deleteDetailError) {
                        // Might be used by others? Log warning.
                        console.warn('Could not delete detached details (might be shared):', deleteDetailError);
                    }
                }
            }
        }
    }

    return { success: true };
}

export async function deleteAvailableAsset(id: number) {
    // 1. Fetch details to clean up (Save IDs before deleting links)
    const { data: links, error: fetchError } = await supabase
        .from('ASSET_DETAIL')
        .select('detail_id')
        .eq('asset_id', id);

    if (fetchError) {
        console.error('Error fetching asset details for deletion:', fetchError);
        return { success: false, error: fetchError.message };
    }

    const detailIds = links?.map(l => l.detail_id) || [];

    // 2. Delete Links FIRST (ASSET_DETAIL) - Resolves FK Constraint
    const { error: deleteLinksError } = await supabase
        .from('ASSET_DETAIL')
        .delete()
        .eq('asset_id', id);

    if (deleteLinksError) {
        console.error('Error deleting asset links:', deleteLinksError);
        return { success: false, error: deleteLinksError.message };
    }

    // 3. Delete Asset (ASSET)
    const { error: deleteAssetError } = await supabase
        .from('ASSET')
        .delete()
        .eq('asset_id', id);

    if (deleteAssetError) {
        console.error('Error deleting asset:', deleteAssetError);
        return { success: false, error: deleteAssetError.message };
    }

    // 4. Cleanup Details (DETAIL) - Private Model
    if (detailIds.length > 0) {
        const { error: deleteDetailsError } = await supabase
            .from('DETAIL')
            .delete()
            .in('detail_id', detailIds);

        if (deleteDetailsError) {
            console.warn('Error deleting detached details:', deleteDetailsError);
        }
    }

    return { success: true };
}

// --- User Assets Management (USER_ASSET) ---

export async function updateUserAsset(userAssetId: number, data: any) {
    const { error } = await supabase
        .from('USER_ASSET')
        .update(data)
        .eq('user_asset_id', userAssetId);

    if (error) {
        console.error('Error updating user asset:', error);
        return { success: false, error: error.message };
    }
    return { success: true };
}

export async function deleteUserAsset(userAssetId: number) {
    const { error } = await supabase
        .from('USER_ASSET')
        .delete()
        .eq('user_asset_id', userAssetId);

    if (error) {
        console.error('Error deleting user asset:', error);
        return { success: false, error: error.message };
    }
    return { success: true };
}
