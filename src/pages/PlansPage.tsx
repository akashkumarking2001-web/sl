import React from "react";
import PlansSection from "@/components/sections/PlansSection";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Capacitor } from "@capacitor/core";
import NativeHeader from "@/components/layout/NativeHeader";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PlansPage = () => {
    const isNative = Capacitor.isNativePlatform() || ['8080', '5174'].includes(window.location.port);
    const navigate = useNavigate();

    if (isNative) {
        return (
            <div className="min-h-screen bg-[#000000] text-white font-sans">
                <div className="fixed top-0 left-0 right-0 z-[100] bg-black/80 backdrop-blur-2xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-gray-400">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-sm font-black uppercase tracking-[0.2em]">Premium Packages</h1>
                    <div className="w-10" /> {/* Spacer */}
                </div>

                <div className="pt-20">
                    <PlansSection />
                </div>

                <footer className="py-12 text-center text-muted-foreground/30 text-[10px] uppercase font-bold tracking-widest">
                    Skill Learners Academy &copy; 2024 • Excellence in Education
                </footer>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-20">
                <PlansSection />
            </div>
            <Footer />
        </div>
    );
};

export default PlansPage;
