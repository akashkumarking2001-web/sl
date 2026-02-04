import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const useAdminCheck = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fallback constants
    const SUPABASE_URL = "https://vwzqaloqlvlewvijiqeu.supabase.co";
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3enFhbG9xbHZsZXd2aWppcWV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNjMwMjQsImV4cCI6MjA4NDkzOTAyNH0.oEuQrpidyXbKYdy3SpuMDTHZveqZNHaJHMY3TK3ir2E";

    const checkAdminRole = async (retryCount = 0) => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // Master Admin Safety Bypass
        if (user.email === "admin@ascendacademy.com") {
          setIsAdmin(true);
          setLoading(false);
          return;
        }

        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/has_role`, {
          method: "POST",
          headers: {
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            _user_id: user.id,
            _role: "admin",
          })
        });

        if (!response.ok) {
          // Handle 406 Not Acceptable or regular failures (sometimes rpc returns void/null)
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        setIsAdmin(data === true);
        setLoading(false);

      } catch (error: any) {
        console.warn(`Admin check attempt ${retryCount + 1} failed:`, error.message);

        if (retryCount < 3) {
          setTimeout(() => checkAdminRole(retryCount + 1), 1000 * (retryCount + 1));
          return;
        }

        console.error("Error checking admin role final:", error);
        setIsAdmin(false);
        setLoading(false);
      }
    };

    checkAdminRole();
  }, [user]);

  return { isAdmin, loading };
};
