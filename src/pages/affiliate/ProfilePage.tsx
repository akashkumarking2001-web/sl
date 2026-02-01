import { useState, useEffect } from "react";
import {
  User,
  Camera,
  Mail,
  Phone,
  MapPin,
  Building,
  CreditCard,
  Lock,
  Save,
  Eye,
  EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<"personal" | "bank" | "password">("personal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { profile: authProfile, loading } = useAuth();
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });

  const [profile, setProfile] = useState({
    photo: null as string | null,
    name: "Agent",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  useEffect(() => {
    if (authProfile) {
      setProfile(p => ({
        ...p,
        name: authProfile.full_name || p.name,
        email: authProfile.email || p.email
      }));
    }
  }, [authProfile]);

  const [bankDetails, setBankDetails] = useState({
    accountHolder: "John Doe",
    accountNumber: "1234567890",
    ifscCode: "SBIN0001234",
    bankName: "State Bank of India",
    upiId: "john@upi",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const { toast } = useToast();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile({ ...profile, photo: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    toast({ title: "Profile Updated!", description: "Your changes have been saved successfully." });
  };

  const handleBankSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    toast({ title: "Bank Details Updated!", description: "Your bank information has been saved." });
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast({ title: "Error", description: "New passwords don't match", variant: "destructive" });
      return;
    }
    if (passwords.new.length < 8) {
      toast({ title: "Error", description: "Password must be at least 8 characters", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setPasswords({ current: "", new: "", confirm: "" });
    toast({ title: "Password Changed!", description: "Your password has been updated successfully." });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-3xl mx-auto">
          {/* Header with Photo */}
          <div className="glass-card p-6 lg:p-8 rounded-3xl mb-6 bg-gradient-to-r from-primary/10 to-accent/10">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-28 h-28 rounded-full bg-gradient-gold flex items-center justify-center shadow-xl ring-4 ring-background overflow-hidden">
                  {profile.photo ? (
                    <img src={profile.photo} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-bold text-primary-foreground">{profile.name.charAt(0)}</span>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 w-9 h-9 bg-primary rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-primary/90 transition-colors">
                  <Camera className="w-4 h-4 text-primary-foreground" />
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                </label>
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl font-bold font-display">{profile.name}</h1>
                <p className="text-muted-foreground">User ID: {authProfile?.id?.substring(0, 8) || "..."}</p>
                <p className="text-sm text-primary font-medium mt-1">{authProfile?.purchased_plan || "Standard"} Member</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <Button
              variant={activeTab === "personal" ? "hero" : "outline"}
              size="sm"
              onClick={() => setActiveTab("personal")}
              className="gap-2"
            >
              <User className="w-4 h-4" />
              Personal Details
            </Button>
            <Button
              variant={activeTab === "bank" ? "hero" : "outline"}
              size="sm"
              onClick={() => setActiveTab("bank")}
              className="gap-2"
            >
              <Building className="w-4 h-4" />
              Bank Account
            </Button>
            <Button
              variant={activeTab === "password" ? "hero" : "outline"}
              size="sm"
              onClick={() => setActiveTab("password")}
              className="gap-2"
            >
              <Lock className="w-4 h-4" />
              Change Password
            </Button>
          </div>

          {/* Personal Details Form */}
          {activeTab === "personal" && (
            <form onSubmit={handleProfileSave} className="glass-card p-6 rounded-3xl space-y-4">
              <h2 className="text-xl font-bold font-display mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Personal Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    Full Name
                  </Label>
                  <Input
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    Email
                  </Label>
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    Phone Number
                  </Label>
                  <Input
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    Address
                  </Label>
                  <Input
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="mb-2 block">City</Label>
                  <Input
                    value={profile.city}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="mb-2 block">State</Label>
                  <Input
                    value={profile.state}
                    onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Pincode</Label>
                  <Input
                    value={profile.pincode}
                    onChange={(e) => setProfile({ ...profile, pincode: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Country</Label>
                  <Input
                    value={profile.country}
                    onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                  />
                </div>
              </div>

              <Button type="submit" variant="hero" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </form>
          )}

          {/* Bank Details Form */}
          {activeTab === "bank" && (
            <form onSubmit={handleBankSave} className="glass-card p-6 rounded-3xl space-y-4">
              <h2 className="text-xl font-bold font-display mb-4 flex items-center gap-2">
                <Building className="w-5 h-5 text-primary" />
                Bank Account Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2 block">Account Holder Name</Label>
                  <Input
                    value={bankDetails.accountHolder}
                    onChange={(e) => setBankDetails({ ...bankDetails, accountHolder: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Account Number</Label>
                  <Input
                    value={bankDetails.accountNumber}
                    onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="mb-2 block">IFSC Code</Label>
                  <Input
                    value={bankDetails.ifscCode}
                    onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Bank Name</Label>
                  <Input
                    value={bankDetails.bankName}
                    onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label className="flex items-center gap-2 mb-2">
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                    UPI ID (Optional)
                  </Label>
                  <Input
                    value={bankDetails.upiId}
                    onChange={(e) => setBankDetails({ ...bankDetails, upiId: e.target.value })}
                    placeholder="yourname@upi"
                  />
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> Ensure your bank details are correct. Withdrawals will be processed to this account.
                </p>
              </div>

              <Button type="submit" variant="hero" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Bank Details
                  </>
                )}
              </Button>
            </form>
          )}

          {/* Change Password Form */}
          {activeTab === "password" && (
            <form onSubmit={handlePasswordChange} className="glass-card p-6 rounded-3xl space-y-4">
              <h2 className="text-xl font-bold font-display mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Change Password
              </h2>

              <div>
                <Label className="mb-2 block">Current Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword.current ? "text" : "password"}
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword.current ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                  </button>
                </div>
              </div>

              <div>
                <Label className="mb-2 block">New Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword.new ? "text" : "password"}
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword.new ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Minimum 8 characters</p>
              </div>

              <div>
                <Label className="mb-2 block">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword.confirm ? "text" : "password"}
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword.confirm ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                  </button>
                </div>
              </div>

              <Button type="submit" variant="hero" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Update Password
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
