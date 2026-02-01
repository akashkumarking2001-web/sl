import { User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const AdminProfile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-md mx-auto">
      <div className="glass-card p-6 rounded-2xl space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Admin Profile</h2>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b"><span className="text-muted-foreground">User ID</span><span className="font-mono">{user?.id?.slice(0, 8)}...</span></div>
          <div className="flex justify-between py-2 border-b"><span className="text-muted-foreground">Email</span><span>{user?.email}</span></div>
          <div className="flex justify-between py-2 border-b"><span className="text-muted-foreground">Role</span><span className="text-primary font-medium">Administrator</span></div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;