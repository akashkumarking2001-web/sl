// ==============================================================================
// E-COMMERCE TYPES - Temporary Type Definitions
// ==============================================================================
// This file provides TypeScript types for the new e-commerce tables
// until Supabase types are regenerated
// ==============================================================================

export interface ProductCategory {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: string;
    category_id: string | null;
    name: string;
    slug: string;
    description: string | null;
    short_description: string | null;
    image_url: string | null;
    gallery_images: string[] | null;
    mrp: number;
    price: number;
    cashback_amount: number;
    cashback_percentage: number;
    stock_quantity: number;
    is_featured: boolean;
    is_active: boolean;
    tags: string[] | null;
    specifications: Record<string, any> | null;
    created_at: string;
    updated_at: string;
}

export interface AffiliateApplication {
    id: string;
    user_id: string;
    full_name: string;
    email: string;
    phone: string | null;
    address: string | null;
    why_join: string | null;
    experience: string | null;
    status: 'pending' | 'approved' | 'rejected';
    admin_notes: string | null;
    approved_by: string | null;
    approved_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface AffiliateLink {
    id: string;
    user_id: string;
    product_id: string | null;
    referral_code: string;
    clicks: number;
    conversions: number;
    total_commission: number;
    created_at: string;
}

export interface AffiliateClick {
    id: string;
    affiliate_link_id: string;
    ip_address: string | null;
    user_agent: string | null;
    referrer: string | null;
    clicked_at: string;
}

export interface ShoppingOrder {
    id: string;
    user_id: string;
    product_id: string | null;
    affiliate_user_id: string | null;
    quantity: number;
    unit_price: number;
    total_price: number;
    cashback_amount: number;
    affiliate_commission: number;
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    payment_status: 'pending' | 'approved' | 'failed';
    shipping_address: Record<string, any> | null;
    tracking_number: string | null;
    transaction_id: string | null;
    created_at: string;
    updated_at: string;
}

export interface Wishlist {
    id: string;
    user_id: string;
    product_id: string;
    created_at: string;
}

// Extended Supabase Database type (to be merged with existing types)
export interface EcommerceDatabase {
    public: {
        Tables: {
            product_categories: {
                Row: ProductCategory;
                Insert: Omit<ProductCategory, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<ProductCategory, 'id' | 'created_at' | 'updated_at'>>;
            };
            products: {
                Row: Product;
                Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>;
            };
            affiliate_applications: {
                Row: AffiliateApplication;
                Insert: Omit<AffiliateApplication, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<AffiliateApplication, 'id' | 'created_at' | 'updated_at'>>;
            };
            affiliate_links: {
                Row: AffiliateLink;
                Insert: Omit<AffiliateLink, 'id' | 'created_at'>;
                Update: Partial<Omit<AffiliateLink, 'id' | 'created_at'>>;
            };
            affiliate_clicks: {
                Row: AffiliateClick;
                Insert: Omit<AffiliateClick, 'id' | 'clicked_at'>;
                Update: Partial<Omit<AffiliateClick, 'id' | 'clicked_at'>>;
            };
            shopping_orders: {
                Row: ShoppingOrder;
                Insert: Omit<ShoppingOrder, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<ShoppingOrder, 'id' | 'created_at' | 'updated_at'>>;
            };
            wishlist: {
                Row: Wishlist;
                Insert: Omit<Wishlist, 'id' | 'created_at'>;
                Update: Partial<Omit<Wishlist, 'id' | 'created_at'>>;
            };
        };
        Functions: {
            generate_affiliate_code: {
                Args: { p_user_id: string; p_product_id: string };
                Returns: string;
            };
            create_affiliate_link: {
                Args: { p_user_id: string; p_product_id: string };
                Returns: string;
            };
            track_affiliate_click: {
                Args: { p_referral_code: string; p_ip: string; p_user_agent: string };
                Returns: void;
            };
            process_affiliate_commission: {
                Args: { p_order_id: string };
                Returns: void;
            };
        };
    };
}
