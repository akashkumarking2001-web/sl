import { useState, useEffect, useCallback } from 'react';

export const useCountdown = (initialSeconds: number, onComplete?: () => void) => {
    const [timeLeft, setTimeLeft] = useState(initialSeconds);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            if (onComplete) onComplete();
        }
        return () => clearInterval(timer);
    }, [isActive, timeLeft, onComplete]);

    const start = useCallback((seconds?: number) => {
        if (seconds !== undefined) setTimeLeft(seconds);
        setIsActive(true);
    }, []);

    const reset = useCallback((seconds: number) => {
        setTimeLeft(seconds);
        setIsActive(false);
    }, []);

    const stop = useCallback(() => {
        setIsActive(false);
    }, []);

    return { timeLeft, start, stop, reset, isActive };
};
