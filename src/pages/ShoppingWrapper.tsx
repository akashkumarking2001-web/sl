import ShoppingPage from "./ShoppingPage";
import AffiliateSidebar from "@/components/layout/AffiliateSidebar";
import { useAuth } from "@/hooks/useAuth";

// Simplified wrapper - directly shows shopping page
// Toggle functionality can be added later
const ShoppingWrapper = () => {
    const { user } = useAuth();

    if (user) {
        return (
            <AffiliateSidebar>
                <ShoppingPage />
            </AffiliateSidebar>
        );
    }

    return <ShoppingPage />;
};

export default ShoppingWrapper;
