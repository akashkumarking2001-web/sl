import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Package {
    id: string;
    code: string;
    name: string;
    price: number;
    headline: string | null;
    description: string | null;
    features: string[] | null;
    bonus: string | null;
    level: number | null;
    color_theme: string | null;
}

export const usePackages = () => {
    return useQuery({
        queryKey: ["packages"],
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 30,  // 30 minutes
        queryFn: async () => {
            const { data, error } = await supabase
                .from("packages")
                .select("*")
                .order("level", { ascending: true });

            if (error) {
                throw error;
            }

            // Parse JSON features if needed or basic string array casting
            return data.map(pkg => ({
                ...pkg,
                features: Array.isArray(pkg.features)
                    ? pkg.features.map(f => String(f))
                    : typeof pkg.features === 'string'
                        ? JSON.parse(pkg.features)
                        : []
            })) as Package[];
        },
    });
};
