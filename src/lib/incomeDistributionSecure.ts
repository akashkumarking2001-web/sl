import { supabase } from "@/integrations/supabase/client";

/**
 * SECURE INCOME DISTRIBUTION
 * This module replaces the client-side logic with secure Server-Side RPC calls.
 * All calculations happen inside the database (PostgreSQL Functions).
 * 
 * NOTE: We cast the function names to 'any' here to avoid TypeScript errors 
 * until you regenerate your Supabase types.
 */

// 1. Distribute All Incomes (Package Purchase)
export const distributeAllIncomesSecure = async (
    buyerId: string,
    packageName: string
): Promise<boolean> => {
    try {
        const { error } = await supabase.rpc('distribute_package_income' as any, {
            p_buyer_id: buyerId,
            p_package_name: packageName
        });

        if (error) {
            console.error('Error in secure income distribution:', error);
            return false;
        }

        return true;
    } catch (err) {
        console.error('Unexpected error calling implementation:', err);
        return false;
    }
};

// 2. Approve WhatsApp Task Submission
export const approveTaskSecure = async (
    submissionId: string
): Promise<boolean> => {
    try {
        const { error } = await supabase.rpc('approve_task_submission' as any, {
            submission_id: submissionId
        });

        if (error) {
            console.error('Error approving task:', error);
            return false;
        }

        return true;
    } catch (err) {
        console.error('Unexpected error approving task:', err);
        return false;
    }
};

// 3. Approve App Task Submission
export const approveAppTaskSecure = async (
    submissionId: string
): Promise<boolean> => {
    try {
        const { error } = await supabase.rpc('approve_app_task_submission' as any, {
            submission_id: submissionId
        });

        if (error) {
            console.error('Error approving app task:', error);
            return false;
        }

        return true;
    } catch (err) {
        console.error('Unexpected error approving app task:', err);
        return false;
    }
};
