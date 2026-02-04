import ShoppingPage from "./ShoppingPage";
import ShoppingSidebar from "@/components/layout/ShoppingSidebar";
import { useAuth } from "@/hooks/useAuth";

// Simplified wrapper - directly shows shopping page
// Toggle functionality can be added later
const ShoppingWrapper = () => {
    const { user } = useAuth();

    if (user) {
        return (
            <ShoppingSidebar>
                <ShoppingPage />
            </ShoppingSidebar>
        );
    }

    return <ShoppingPage />;
};

export default ShoppingWrapper;
