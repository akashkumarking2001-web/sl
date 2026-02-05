import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Course {
    id: string;
    course_name: string;
    description: string | null;
    price: number;
    category: string | null;
    level: string | null;
    duration: string | null;
    thumbnail_url?: string | null;
    is_active: boolean;
    package: string | null;
    rating?: number;
    students?: number;
    modules?: number;
}

export const useCourses = () => {
    return useQuery({
        queryKey: ["courses"],
        staleTime: 1000 * 60 * 5, // 5 minutes
        queryFn: async () => {
            const { data, error } = await supabase
                .from("courses")
                .select("*")
                .eq("is_active", true)
                .order("created_at", { ascending: false });

            if (error) throw error;

            // Map DB fields to our frontend Course interface if needed
            return data.map(course => ({
                ...course,
                title: course.course_name, // Map for convenience
                image: (course as any).image_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
                rating: 4.5 + Math.random() * 0.5, // Mocking these for now as DB doesn't have them
                students: Math.floor(Math.random() * 5000) + 1000,
                modules: Math.floor(Math.random() * 15) + 5,
            })) as any[];
        },
    });
};
