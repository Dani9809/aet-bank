'use server'

import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { cookies } from 'next/headers';

const SignupSchema = z.object({
    account_fname: z.string().min(1, "First name is required"),
    account_lname: z.string().min(1, "Last name is required"),
    account_address: z.string().min(1, "Address is required"),
    account_email: z.string().email("Invalid email"),
    account_uname: z.string().min(4, "Username must be at least 4 chars"),
    account_pword: z.string().min(6, "Password must be at least 6 chars"),
    account_pin: z.string().length(6, "PIN must be exactly 6 digits"),
});

export async function checkEmailUnique(email: string) {
    const { data, error } = await supabase
        .from('ACCOUNT') // Assuming table name is ACCOUNT based on prompt context
        .select('account_id')
        .eq('account_email', email)
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows found"
        console.error('Email check error:', error);
        return false; // Assume not unique on error to be safe, or handle differently
    }
    return !data; // If data exists, it's NOT unique. If !data, it IS unique.
}

export async function checkUsernameUnique(username: string) {
    const { data, error } = await supabase
        .from('ACCOUNT')
        .select('account_id')
        .eq('account_uname', username)
        .single();

    if (error && error.code !== 'PGRST116') {
        console.error('Username check error:', error);
        return false;
    }
    return !data;
}

export async function signupAdmin(formData: z.infer<typeof SignupSchema>) {
    const validated = SignupSchema.safeParse(formData);
    if (!validated.success) {
        return { success: false, error: validated.error.issues[0].message };
    }

    const { account_pword, account_pin, ...rest } = validated.data;

    // Double check uniqueness (race condition mitigation)
    const isEmailUnique = await checkEmailUnique(rest.account_email);
    if (!isEmailUnique) return { success: false, error: "Email already taken" };

    const isUserUnique = await checkUsernameUnique(rest.account_uname);
    if (!isUserUnique) return { success: false, error: "Username already taken" };

    // Hash password and pin
    const hashedPassword = await bcrypt.hash(account_pword, 12);
    const hashedPin = await bcrypt.hash(account_pin, 12);

    const { error } = await supabase.from('ACCOUNT').insert({
        ...rest,
        account_pword: hashedPassword,
        account_pin: hashedPin,
        account_status: 0, // Default not active
        type_id: 99 // Admin type (or wait, prompt says "If type_id != 99, not admin". Signup creates type 99? "when signup... type_id = 99". Yes.)
    });

    if (error) {
        console.error('Signup error:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

export async function loginAdmin(prevState: any, formData: FormData) {
    // Simple login via username/password first
    const username = formData.get('account_uname') as string;
    const password = formData.get('account_pword') as string;

    if (!username || !password) {
        return { success: false, error: "Missing credentials" };
    }

    const { data: user, error } = await supabase
        .from('ACCOUNT')
        .select('*')
        .eq('account_uname', username)
        .single();

    if (error || !user) {
        return { success: false, error: "Invalid credentials" }; // Generic error
    }

    // Check Password
    const isPasswordValid = await bcrypt.compare(password, user.account_pword);
    if (!isPasswordValid) {
        return { success: false, error: "Invalid credentials" };
    }

    // Check Status
    if (user.account_status === 0) {
        return { success: false, error: "Account is not active." };
    }

    // Check Type
    if (user.type_id !== 99) {
        return { success: false, error: "Access denied. Not an admin account." };
    }

    // If we reach here, credentials are valid.
    // The UI will likely handle the "PIN" step separately as a second confirmation 
    // OR we return a success state that prompts the UI to ask for PIN if this was just the first step.
    // The prompt says "After credentials validation: Final popup modal confirmation: Pin".
    // So this action might just verify credentials and return "Ready for PIN".

    return { success: true, userId: user.account_id, requirePin: true };
}

export async function verifyAdminPin(userId: number, pin: string) {
    const { data: user, error } = await supabase
        .from('ACCOUNT')
        .select('account_pin')
        .eq('account_id', userId)
        .single();

    if (error || !user) return { success: false, error: "User not found" };

    const isPinValid = await bcrypt.compare(pin, user.account_pin);
    if (!isPinValid) return { success: false, error: "Invalid PIN" };

    // Set Session
    const cookieStore = await cookies();
    cookieStore.set('admin_session', userId.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
    });

    return { success: true };
}

export async function getAdminSession() {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');
    return session?.value ? parseInt(session.value) : null;
}

export async function logoutAdmin() {
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
}
