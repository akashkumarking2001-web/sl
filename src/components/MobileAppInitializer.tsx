import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { useNativePushNotifications } from '@/hooks/useNativePushNotifications';
import { useNativeFeatures } from '@/hooks/useNativeFeatures';

const MobileAppInitializer = () => {
    useNativePushNotifications();
    const { getCurrentLocation, performBiometricAuth } = useNativeFeatures();

    useEffect(() => {
        const initializeApp = async () => {
            if (Capacitor.isNativePlatform()) {
                console.log('🚀 Initializing Native Mobile Features...');

                // Optional: Trigger biometric on app launch
                // await performBiometricAuth();

                // Optional: Get location for analytics
                await getCurrentLocation();

                try {
                    // Status Bar setup
                    await StatusBar.setStyle({ style: Style.Light });
                    await StatusBar.setBackgroundColor({ color: '#FDFCFB' }); // Matches Light Mode background

                    // Hide Splash Screen after app is ready
                    // Small delay to ensure React Splash is mounted to prevent white flicker
                    setTimeout(async () => {
                        await SplashScreen.hide();
                    }, 500);

                    // Initial haptic feedback to signal app ready
                    await Haptics.impact({ style: ImpactStyle.Light });
                } catch (error) {
                    console.error('Error initializing native features:', error);
                }
            }
        };

        initializeApp();
    }, []);

    return null; // Side-effect component
};

export default MobileAppInitializer;
