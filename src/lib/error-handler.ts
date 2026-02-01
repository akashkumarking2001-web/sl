/**
 * Utility for handling and logging errors in production.
 * Prevents sensitive database schema or connection strings from leaking to the UI.
 */

export const handleServiceError = (error: any, context: string) => {
    // 1. Log full error internally for developers (masked from production builds usually)
    console.group(`[Service Error] ${context}`);
    console.error(error);
    console.groupEnd();

    // 2. Suppress AbortErrors (normal behavior)
    if (error?.name === 'AbortError' || error?.message?.includes('aborted')) {
        return null;
    }

    // 3. Return a user-friendly message
    if (error?.message?.includes("JWT") || error?.status === 401) {
        return "Your session has expired. Please log in again.";
    }

    if (error?.code === "PGRST116") {
        return "The requested record was not found.";
    }

    return "A system error occurred. Please try again or contact support if the issue persists.";
};
