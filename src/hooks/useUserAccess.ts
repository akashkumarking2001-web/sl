import { useState, useEffect, createContext, useContext } from "react";

interface UserAccessState {
  hasPurchased: boolean;
  purchasedPackages: string[];
  paymentPending: boolean;
  isLoading: boolean;
}

// Mock - In production, this would fetch from backend
export const useUserAccess = () => {
  const [state, setState] = useState<UserAccessState>({
    hasPurchased: false,
    purchasedPackages: [],
    paymentPending: false,
    isLoading: true,
  });

  useEffect(() => {
    // Simulate checking user's purchase status from backend
    const checkAccess = () => {
      const storedPurchases = localStorage.getItem("userPurchases");
      const pendingPayment = localStorage.getItem("pendingPayment");
      
      if (storedPurchases) {
        const packages = JSON.parse(storedPurchases);
        setState({
          hasPurchased: packages.length > 0,
          purchasedPackages: packages,
          paymentPending: !!pendingPayment,
          isLoading: false,
        });
      } else {
        setState({
          hasPurchased: false,
          purchasedPackages: [],
          paymentPending: !!pendingPayment,
          isLoading: false,
        });
      }
    };

    checkAccess();
  }, []);

  const setPurchased = (packages: string[]) => {
    localStorage.setItem("userPurchases", JSON.stringify(packages));
    setState(prev => ({
      ...prev,
      hasPurchased: packages.length > 0,
      purchasedPackages: packages,
    }));
  };

  const setPaymentPending = (transactionId: string) => {
    localStorage.setItem("pendingPayment", transactionId);
    setState(prev => ({ ...prev, paymentPending: true }));
  };

  const clearPending = () => {
    localStorage.removeItem("pendingPayment");
    setState(prev => ({ ...prev, paymentPending: false }));
  };

  return { ...state, setPurchased, setPaymentPending, clearPending };
};

// For demo purposes - toggle this to test locked/unlocked states
export const DEMO_MODE = {
  // Set to true to simulate a user who has purchased
  hasPurchased: false,
  purchasedPackages: [] as string[],
};