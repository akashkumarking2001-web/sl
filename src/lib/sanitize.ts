/**
 * Simple sanitization utility to prevent XSS and clean inputs.
 */

export const sanitizeString = (str: string): string => {
    if (!str) return "";
    // Basic HTML escape
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

export const validatePrice = (price: string | number): number => {
    const p = typeof price === "string" ? parseFloat(price) : price;
    return isNaN(p) || p < 0 ? 0 : p;
};

export const isValidUrl = (url: string): boolean => {
    if (!url) return true; // Optional fields
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};
