/**
 * Security Utility for Ascend Academy
 * Handles environment-based features and security checks.
 */

const isDev = import.meta.env.DEV;

export const security = {
    /**
     * Returns true if debug features like Emergency Admin Bypass should be enabled.
     * STRICTLY DISABLED IN PRODUCTION.
     */
    allowDebugFeatures: () => {
        return isDev;
    },

    /**
     * Sanitizes user input for basic XSS prevention if needed manually
     */
    sanitizeText: (text: string) => {
        return text.replace(/<[^>]*>?/gm, '');
    },

    /**
     * Clears sensitive data from local storage
     */
    clearSensitiveData: () => {
        localStorage.removeItem('is_emergency_admin');
        // Add other sensitive keys here
    }
};
