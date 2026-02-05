import { useState, useCallback } from 'react';
import { useToast } from './use-toast';

export const useClipboard = (timeout = 2000) => {
    const [hasCopied, setHasCopied] = useState(false);
    const { toast } = useToast();

    const copy = useCallback((text: string, label?: string) => {
        if (!text) return;

        navigator.clipboard.writeText(text).then(() => {
            setHasCopied(true);
            if (label) {
                toast({
                    title: "Copied!",
                    description: `${label} copied to clipboard.`,
                });
            }
            setTimeout(() => setHasCopied(false), timeout);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }, [toast, timeout]);

    return { copy, hasCopied };
};
