import { supabase } from "@/integrations/supabase/client";

/**
 * DEPRECATED: INSECURE CLIENT-SIDE LOGIC
 * ==============================================================================
 * This file contains the legacy client-side income distribution logic.
 * It has been replaced by secure database functions (RPC) in 'incomeDistributionSecure.ts'.
 * 
 * DO NOT USE THIS FILE IN PRODUCTION.
 * ALL LOGIC HAS BEEN MIGRATED TO THE DATABASE 'distribute_package_income' FUNCTION.
 * ==============================================================================
 */

/**
 * Logs a warning when insecure functions are accessed.
 */
const logDeprecationWarning = (functionName: string) => {
  console.warn(`SECURITY WARNING: Calling deprecated function '${functionName}'. Use server-side alternative from 'incomeDistributionSecure.ts'.`);
};

export const distributeAllIncomes = async (buyerId: string, packageName: string) => {
  logDeprecationWarning('distributeAllIncomes');
  console.error("This function is disabled for security. Use distributeAllIncomesSecure instead.");
  return false;
};

// ... (Other functions are also disabled/stubbed to prevent accidental use)
export const creditWallet = async () => false;
export const distributeReferralIncome = async () => { };
export const distributeLevelIncome = async () => { };
export const checkSpilloverMilestones = async () => { };
export const processRevenueShareTree = async () => { };
