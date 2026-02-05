/**
 * Accessibility utilities for improving UX
 * Includes ARIA live regions, skip links, and focus management
 */

import { useEffect, useRef } from 'react';

/**
 * Announce message to screen readers
 */
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
};

/**
 * Hook to manage focus trap in modals/dialogs
 */
export const useFocusTrap = (isActive: boolean) => {
    const containerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!isActive || !containerRef.current) return;

        const container = containerRef.current;
        const focusableElements = container.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleTabKey = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement?.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement?.focus();
                }
            }
        };

        // Focus first element
        firstElement?.focus();

        container.addEventListener('keydown', handleTabKey as EventListener);

        return () => {
            container.removeEventListener('keydown', handleTabKey as EventListener);
        };
    }, [isActive]);

    return containerRef;
};

/**
 * Hook to restore focus after modal closes
 */
export const useRestoreFocus = (isOpen: boolean) => {
    const previousActiveElement = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (isOpen) {
            previousActiveElement.current = document.activeElement as HTMLElement;
        } else if (previousActiveElement.current) {
            previousActiveElement.current.focus();
            previousActiveElement.current = null;
        }
    }, [isOpen]);
};

/**
 * Generate unique ID for accessibility
 */
let idCounter = 0;
export const useAccessibleId = (prefix: string = 'a11y') => {
    const idRef = useRef<string>();

    if (!idRef.current) {
        idRef.current = `${prefix}-${++idCounter}`;
    }

    return idRef.current;
};

/**
 * Skip to main content link (for keyboard navigation)
 */
export const SkipToContent = () => {
    return (
        <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg"
        >
            Skip to main content
        </a>
    );
};

/**
 * Visually hidden but accessible to screen readers
 */
export const VisuallyHidden = ({ children }: { children: React.ReactNode }) => {
    return <span className="sr-only">{children}</span>;
};

/**
 * Live region for dynamic content announcements
 */
interface LiveRegionProps {
    message: string;
    priority?: 'polite' | 'assertive';
    clearAfter?: number;
}

export const LiveRegion = ({ message, priority = 'polite', clearAfter }: LiveRegionProps) => {
    useEffect(() => {
        if (clearAfter && message) {
            const timer = setTimeout(() => {
                // Message will be cleared by parent component
            }, clearAfter);

            return () => clearTimeout(timer);
        }
    }, [message, clearAfter]);

    if (!message) return null;

    return (
        <div
            role="status"
            aria-live={priority}
            aria-atomic="true"
            className="sr-only"
        >
            {message}
        </div>
    );
};

/**
 * Keyboard shortcut helper
 */
export const useKeyboardShortcut = (
    key: string,
    callback: () => void,
    modifiers: { ctrl?: boolean; shift?: boolean; alt?: boolean } = {}
) => {
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            const matchesModifiers =
                (!modifiers.ctrl || e.ctrlKey) &&
                (!modifiers.shift || e.shiftKey) &&
                (!modifiers.alt || e.altKey);

            if (e.key === key && matchesModifiers) {
                e.preventDefault();
                callback();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [key, callback, modifiers]);
};
