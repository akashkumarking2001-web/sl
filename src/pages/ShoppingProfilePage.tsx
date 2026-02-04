import ShoppingSidebar from "@/components/layout/ShoppingSidebar";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/layout/Navbar";
import { User, Mail, Phone, Shield, Bell, LogOut, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const ShoppingProfilePage = () => {
    const { user, signOut } = useAuth();

    const Content = () => (
        <div className="container mx-auto p-6 space-y-8 animate-in fade-in duration-500 max-w-4xl">
            <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Account Settings</h1>
                <p className="text-muted-foreground">Manage your personal information and preferences.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Sidebar / Quick Actions */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-950 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                        <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-slate-50 dark:border-slate-900 shadow-xl">
                            <AvatarImage src={user?.user_metadata?.avatar_url} />
                            <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                                {user?.user_metadata?.full_name?.charAt(0) || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <h2 className="font-bold text-xl mb-1">{user?.user_metadata?.full_name || "User"}</h2>
                        <p className="text-sm text-muted-foreground mb-6">{user?.email}</p>
                        <Button variant="destructive" className="w-full rounded-xl" onClick={signOut}>
                            <LogOut className="w-4 h-4 mr-2" /> Sign Out
                        </Button>
                    </div>
                </div>

                {/* Main Settings Form */}
                <div className="md:col-span-2 space-y-8">
                    {/* Personal Info */}
                    <section className="bg-white dark:bg-slate-950 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary"><User className="w-5 h-5" /></div>
                            <h3 className="font-bold text-lg">Personal Information</h3>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Full Name</Label>
                                <Input defaultValue={user?.user_metadata?.full_name} className="h-11 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800" />
                            </div>
                            <div className="space-y-2">
                                <Label>Display Name</Label>
                                <Input defaultValue={user?.user_metadata?.full_name?.split(' ')[0]} className="h-11 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                                <Input defaultValue={user?.email} disabled className="pl-10 h-11 rounded-xl bg-slate-100 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-muted-foreground" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Phone Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                                <Input placeholder="+91 98765 43210" className="pl-10 h-11 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800" />
                            </div>
                        </div>
                        <div className="pt-2">
                            <Button className="rounded-xl font-bold px-8">Save Changes</Button>
                        </div>
                    </section>

                    {/* Notifications */}
                    <section className="bg-white dark:bg-slate-950 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400"><Bell className="w-5 h-5" /></div>
                            <h3 className="font-bold text-lg">Notifications</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Order Updates</Label>
                                    <p className="text-sm text-muted-foreground">Receive updates about your delivery status.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Promotional Emails</Label>
                                    <p className="text-sm text-muted-foreground">Receive emails about new products and sales.</p>
                                </div>
                                <Switch />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );

    if (user) {
        return (
            <ShoppingSidebar>
                <Content />
            </ShoppingSidebar>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <Content />
        </div>
    );
};

export default ShoppingProfilePage;
