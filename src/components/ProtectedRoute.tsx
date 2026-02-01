import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}


const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  // 1. Not logged in
  if (!user) {
    const redirectPath = requireAdmin ? "/admin-login" : "/login";
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // 2. Logged in but trying to access admin route without admin role
  const isMasterAdmin = user.email === "admin@ascendacademy.com";
  if (requireAdmin && profile?.role !== 'admin' && !isMasterAdmin) {
    console.warn("Unauthorized admin access attempt by:", user.email, "Role:", profile?.role);
    return <Navigate to="/user-home" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
