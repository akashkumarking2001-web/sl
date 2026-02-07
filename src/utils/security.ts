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
        const isLocal = typeof window !== 'undefined' &&
            (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
        return isDev || isLocal;
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
