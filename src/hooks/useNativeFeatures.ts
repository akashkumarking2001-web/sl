import { Geolocation } from '@capacitor/geolocation';
import { NativeBiometric } from '@capacitor-community/native-biometric';
import { Capacitor } from '@capacitor/core';
import { useToast } from '@/hooks/use-toast';

export const useNativeFeatures = () => {
    const { toast } = useToast();

    const getCurrentLocation = async () => {
        if (!Capacitor.isNativePlatform()) return null;
        try {
            const coordinates = await Geolocation.getCurrentPosition();
            console.log('Current position:', coordinates);
            return coordinates;
        } catch (error) {
            console.error('Error getting location', error);
            return null;
        }
    };

    const performBiometricAuth = async () => {
        if (!Capacitor.isNativePlatform()) return true;

        try {
            const result = await NativeBiometric.isAvailable();
            if (!result.isAvailable) return true;

            await NativeBiometric.verifyIdentity({
                reason: "For easy log in",
                title: "Log in",
                subtitle: "Confirm your identity",
                description: "Please authenticate to continue.",
            });

            return true;
        } catch (error) {
            console.error('Biometric auth failed', error);
            toast({
                title: "Auth Failed",
                description: "Could not verify identity. Please use your credentials.",
                variant: "destructive"
            });
            return false;
        }
    };

    return { getCurrentLocation, performBiometricAuth };
};
