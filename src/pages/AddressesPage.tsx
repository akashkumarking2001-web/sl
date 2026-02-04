import AddressManager from "@/components/shopping/AddressManager";
import ShoppingSidebar from "@/components/layout/ShoppingSidebar";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";

const AddressesPage = () => {
    const { user } = useAuth();

    // Mock handler for selection, in real app this might update context or state
    const handleSelectAddress = (address: any) => {
        console.log("Selected address:", address);
    };

    const Content = () => (
        <div className="container mx-auto p-6 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">Your Addresses</h1>
                    <p className="text-muted-foreground">Manage delivery locations for faster checkout.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-950 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                <AddressManager onSelectAddress={handleSelectAddress} />
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

export default AddressesPage;
