import React from 'react';
import AffiliateSidebar from '@/components/layout/AffiliateSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Shield, Settings, LogOut, Camera } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const ProfilePage = () => {
    const { user, profile, signOut } = useAuth();

    return (
        <AffiliateSidebar>
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold font-display">Profile Settings</h1>
                    <Button variant="destructive" onClick={signOut} className="gap-2">
                        <LogOut className="w-4 h-4" /> Sign Out
                    </Button>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Left: Avatar & Quick Info */}
                    <Card className="glass-card border-border/50">
                        <CardContent className="pt-8 text-center space-y-4">
                            <div className="relative inline-block">
                                <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center mx-auto overflow-hidden">
                                    <User className="w-12 h-12 text-primary" />
                                </div>
                                <button className="absolute bottom-0 right-0 p-2 bg-white dark:bg-slate-900 rounded-full shadow-lg border border-border">
                                    <Camera className="w-4 h-4 text-primary" />
                                </button>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">{profile?.full_name || "Skill Learner"}</h3>
                                <p className="text-sm text-muted-foreground">{user?.email}</p>
                            </div>
                            <div className="pt-4 border-t border-border flex flex-col gap-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Status</span>
                                    <span className="font-bold text-emerald-500">Active</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">ID</span>
                                    <span className="font-mono">{profile?.referral_code || "N/A"}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right: Detailed Settings */}
                    <div className="md:col-span-2 space-y-6">
                        <Card className="glass-card border-border/50">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <User className="w-5 h-5 text-primary" /> Personal Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" defaultValue={profile?.full_name || ""} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input id="email" defaultValue={user?.email || ""} disabled />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input id="phone" value={profile?.phone || ""} readOnly />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="dob">Date of Birth</Label>
                                        <Input id="dob" type="date" value={profile?.dob?.split('T')[0] || ""} readOnly />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="country">Country</Label>
                                        <Input id="country" value={profile?.country || ""} readOnly />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="state">State</Label>
                                        <Input id="state" value={profile?.state || ""} readOnly />
                                    </div>
                                    <div className="space-y-2 sm:col-span-2">
                                        <Label htmlFor="address">Full Address</Label>
                                        <Input id="address" value={profile?.address || ""} readOnly />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="pincode">Pincode</Label>
                                        <Input id="pincode" value={profile?.pincode || ""} readOnly />
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        <span className="text-primary font-bold block mb-1">Identity Verified</span>
                                        The details above were provided during registration. Contact support to request any changes to your verified identity.
                                    </p>
                                </div>
                                <Button className="bg-[#FBBF24] text-black hover:bg-[#FBBF24]/90 w-full">Update Social Profile</Button>
                            </CardContent>
                        </Card>

                        <Card className="glass-card border-border/50">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-accent" /> Security
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50">
                                    <div>
                                        <p className="font-bold text-sm">Two-Factor Authentication</p>
                                        <p className="text-xs text-muted-foreground">Secure your account with 2FA</p>
                                    </div>
                                    <Button variant="outline" size="sm">Enable</Button>
                                </div>
                                <div className="space-y-2">
                                    <Button variant="outline" className="w-full justify-start gap-2">
                                        <Settings className="w-4 h-4" /> Reset Password
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AffiliateSidebar>
    );
};

export default ProfilePage;
