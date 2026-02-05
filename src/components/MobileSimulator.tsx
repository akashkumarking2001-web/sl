import React from "react";

interface MobileSimulatorProps {
    children: React.ReactNode;
}

const MobileSimulator = ({ children }: MobileSimulatorProps) => {
    const isMobileSim = window.location.port === "5174" || window.location.search.includes("mode=app");

    if (!isMobileSim) return <>{children}</>;

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
            {/* Device Frame */}
            <div className="relative w-[375px] h-[812px] bg-black rounded-[60px] shadow-[0_0_50px_rgba(0,0,0,0.5)] border-[8px] border-zinc-800 overflow-hidden ring-1 ring-white/10 flex flex-col">
                {/* Status Bar / Notch Area */}
                <div className="absolute top-0 inset-x-0 h-10 bg-black z-50 flex items-center justify-center">
                    <div className="w-24 h-6 bg-transparent border-2 border-zinc-800 rounded-full flex gap-2 items-center justify-center">
                        <div className="w-2 h-2 bg-zinc-800 rounded-full" />
                        <div className="w-8 h-2 bg-zinc-800 rounded-full" />
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 mt-10 overflow-y-auto scrollbar-hide bg-white dark:bg-black rounded-b-[42px]">
                    {children}
                </div>

                {/* Home Indicator */}
                <div className="h-6 bg-transparent flex justify-center items-center">
                    <div className="w-24 h-1 bg-zinc-700/50 rounded-full" />
                </div>
            </div>

            {/* Simulation Info */}
            <div className="fixed bottom-8 left-8 bg-zinc-900/80 backdrop-blur-md border border-white/10 p-4 rounded-xl text-white text-xs max-w-xs pointer-events-none">
                <h3 className="font-bold mb-1 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    MOBILE APP MODE
                </h3>
                <p className="opacity-70">Running on Port 5174. Showing pixel-perfect iPhone 13 Pro dimensions (375x812).</p>
            </div>
        </div>
    );
};

export default MobileSimulator;
