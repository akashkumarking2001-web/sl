import React from "react";
import CoursesSection from "@/components/sections/CoursesSection";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Capacitor } from "@capacitor/core";
import { ArrowLeft, BookOpen, Search, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCourses } from "@/hooks/useCourses";
import { courses as staticCourses } from "@/components/sections/CoursesSection";
import ProductCard from "@/components/shopping/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

const AllCoursesPage = () => {
    const isNative = Capacitor.isNativePlatform() || ['8080', '5174'].includes(window.location.port);
    const navigate = useNavigate();
    const { data: dbCourses, isLoading } = useCourses();
    const [searchQuery, setSearchQuery] = React.useState("");

    // Combine courses
    const allCourses = [...(dbCourses || [])];
    const staticIds = new Set(allCourses.map(c => c.id));

    staticCourses.forEach(sc => {
        if (!staticIds.has(sc.id)) {
            allCourses.push({
                ...sc,
                course_name: sc.title,
                thumbnail_url: sc.image,
                is_active: true
            });
        }
    });

    const filteredCourses = allCourses.filter(course =>
        (course.course_name || course.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (course.description || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCourseClick = (course: any) => {
        navigate(`/course/${course.id}`);
    };

    if (isNative) {
        return (
            <div className="min-h-screen bg-[#000000] text-white font-sans">
                {/* Native Header */}
                <div className="fixed top-0 left-0 right-0 z-[100] bg-black/80 backdrop-blur-2xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-gray-400">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-sm font-black uppercase tracking-[0.2em]">Explore Courses</h1>
                    <div className="w-10" />
                </div>

                <div className="pt-20 px-6">
                    <div className="relative mb-8">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input
                            placeholder="Search courses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-11 h-12 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-gray-500 focus:ring-primary/20"
                        />
                    </div>

                    <div className="grid gap-6 pb-20">
                        {filteredCourses.length > 0 ? (
                            filteredCourses.map((course) => (
                                <div
                                    key={course.id}
                                    onClick={() => handleCourseClick(course)}
                                    className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden active:scale-95 transition-transform"
                                >
                                    <img src={course.thumbnail_url || course.image} className="w-full h-40 object-cover" alt="" />
                                    <div className="p-6">
                                        <h3 className="text-lg font-bold mb-2">{course.course_name || course.title}</h3>
                                        <p className="text-sm text-gray-400 line-clamp-2 mb-4">{course.description}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-primary font-bold">₹{course.price.toLocaleString()}</span>
                                            <Button size="sm" variant="outline" className="rounded-xl border-white/10 text-xs font-bold uppercase tracking-widest">Enroll Now</Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 text-gray-500">No courses found matching your search.</div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-32 pb-20 container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl lg:text-5xl font-bold mb-2">Available <span className="text-primary">Courses</span></h1>
                        <p className="text-muted-foreground">Expand your horizons with our expert-led programs.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search courses..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-11 rounded-xl"
                            />
                        </div>
                        <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl shrink-0">
                            <SlidersHorizontal className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCourses.length > 0 ? (
                        filteredCourses.map((course) => (
                            <div
                                key={course.id}
                                onClick={() => handleCourseClick(course)}
                                className="glass-card rounded-[2.5rem] overflow-hidden group hover:-translate-y-2 transition-all duration-500 cursor-pointer border border-border/50"
                            >
                                <div className="relative h-56 overflow-hidden">
                                    <img
                                        src={course.thumbnail_url || course.image}
                                        alt={course.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest border border-white/10">
                                        {course.level || "Beginner"}
                                    </div>
                                </div>
                                <div className="p-8">
                                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{course.course_name || course.title}</h3>
                                    <p className="text-muted-foreground text-sm mb-6 line-clamp-2 leading-relaxed">{course.description}</p>

                                    <div className="flex items-center justify-between pt-6 border-t border-border/50">
                                        <div>
                                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Tuition Fee</p>
                                            <p className="text-2xl font-bold">₹{course.price.toLocaleString()}</p>
                                        </div>
                                        <Button variant="hero" className="rounded-2xl">Enroll Now</Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 bg-muted/30 rounded-[3rem] border border-dashed border-border">
                            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                            <h3 className="text-xl font-bold">No courses found</h3>
                            <p className="text-muted-foreground">Try adjusting your search terms</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AllCoursesPage;
