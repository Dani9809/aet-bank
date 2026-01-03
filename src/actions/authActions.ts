'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function logoutGlobal() {
    const cookieStore = await cookies();

    // List of all known session cookies to clear
    const sessionCookies = ['admin_session', 'user_session', 'supabase-auth-token'];

    sessionCookies.forEach(name => {
        cookieStore.delete(name);
    });

    // Optional: Add logic here to invalidate sessions in DB if you track active sessions

    return { success: true };
}
