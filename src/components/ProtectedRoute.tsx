import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}


import { security } from "@/utils/security";

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  const isDebugAllowed = security.allowDebugFeatures();
  const isEmergencyAdmin = isDebugAllowed && typeof window !== 'undefined' && localStorage.getItem('is_emergency_admin') === 'true';

  // 0. Loading State
  if (loading) {
    if (!isEmergencyAdmin) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Verifying access...</p>
          </div>
        </div>
      );
    }
  }

  // 1. Check Auth State
  // If not logged in AND not an emergency admin, redirect
  if (!user && !loading && !isEmergencyAdmin) {
    const redirectPath = requireAdmin ? "/admin-login" : "/login";
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // 2. Role Check (if required)
  if (requireAdmin) {
    // If emergency admin, ALWAYS allow access (Golden Ticket)
    if (isEmergencyAdmin) {
      return <>{children}</>;
    }

    // Otherwise, check real user role
    const isMasterAdmin = user?.email === "admin@ascendacademy.com";
    if (profile?.role !== 'admin' && !isMasterAdmin) {
      console.warn("Unauthorized admin access attempt by:", user?.email, "Role:", profile?.role);
      return <Navigate to="/user-home" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
