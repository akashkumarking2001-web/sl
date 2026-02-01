import React from 'react';
import { Coins, Film, BookOpen, Lightbulb, GraduationCap, Trophy, Sparkles, Play } from 'lucide-react';

const Hero3DScene: React.FC = () => {
  return (
    <div className="relative w-full h-[500px] md:h-[600px] perspective-1000">
      {/* 3D Container with perspective */}
      <div className="relative w-full h-full transform-style-preserve-3d">
        
        {/* Central 3D Character Scene */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Main 3D Isometric Platform */}
          <div className="relative w-80 h-80 md:w-96 md:h-96">
            {/* Platform Base - Claymorphism style */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-16 md:w-80 md:h-20 bg-gradient-to-br from-primary/30 via-accent/20 to-primary/30 rounded-[50%] blur-xl opacity-60 animate-pulse-slow" />
            
            {/* 3D Laptop Character Scene */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Character with Laptop - 3D Clay Style */}
                <div className="relative w-56 h-56 md:w-72 md:h-72 bg-gradient-to-br from-card via-card to-muted rounded-3xl shadow-2xl transform rotate-[-5deg] hover:rotate-0 transition-transform duration-700 border border-border/50 overflow-hidden">
                  {/* Inner glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
                  
                  {/* Person silhouette with laptop */}
                  <div className="absolute inset-4 flex flex-col items-center justify-center">
                    {/* Head */}
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 shadow-lg mb-2 relative">
                      <div className="absolute inset-2 rounded-full bg-gradient-to-br from-foreground/10 to-foreground/5" />
                      {/* Face glow */}
                      <div className="absolute inset-0 rounded-full shadow-inner" style={{ boxShadow: 'inset 0 -4px 20px rgba(0,0,0,0.1)' }} />
                    </div>
                    
                    {/* Body */}
                    <div className="w-24 h-12 md:w-28 md:h-14 rounded-t-3xl bg-gradient-to-br from-primary/30 to-accent/20 shadow-md" />
                    
                    {/* Laptop */}
                    <div className="relative -mt-2">
                      {/* Laptop Screen */}
                      <div className="w-28 h-16 md:w-36 md:h-20 bg-gradient-to-br from-slate-800 to-slate-900 rounded-t-lg shadow-xl border-2 border-slate-700">
                        {/* Screen content - code/learning */}
                        <div className="p-2 space-y-1">
                          <div className="h-1 w-12 bg-primary/60 rounded" />
                          <div className="h-1 w-8 bg-accent/60 rounded" />
                          <div className="h-1 w-16 bg-primary/40 rounded" />
                          <div className="h-1 w-10 bg-accent/40 rounded" />
                        </div>
                        {/* Screen glow */}
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent rounded-t-lg" />
                      </div>
                      {/* Laptop Base */}
                      <div className="w-32 h-2 md:w-40 md:h-3 bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600 rounded-b-lg shadow-md -mt-px mx-auto" style={{ transform: 'perspective(100px) rotateX(-20deg)' }} />
                    </div>
                  </div>
                  
                  {/* Corner decorations */}
                  <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-primary/20 blur-sm" />
                  <div className="absolute bottom-2 left-2 w-6 h-6 rounded-full bg-accent/20 blur-sm" />
                </div>
                
                {/* 3D Shadow */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-8 bg-black/20 rounded-[50%] blur-xl" />
              </div>
            </div>
            
            {/* Floating 3D Elements */}
            
            {/* Gold Coins - Multiple floating */}
            <div className="absolute top-4 left-0 animate-float-3d">
              <div className="relative">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 shadow-lg transform rotate-12 coin-3d">
                  <div className="absolute inset-1 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-400 flex items-center justify-center">
                    <span className="text-yellow-700 font-bold text-lg">₹</span>
                  </div>
                  {/* Coin shine */}
                  <div className="absolute top-1 left-2 w-3 h-1 bg-white/60 rounded-full rotate-45" />
                </div>
                {/* Coin glow */}
                <div className="absolute inset-0 rounded-full bg-yellow-400/40 blur-md -z-10" />
              </div>
            </div>
            
            <div className="absolute top-16 -left-4 animate-float-3d-delayed">
              <div className="relative">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 shadow-lg transform -rotate-6 coin-3d">
                  <div className="absolute inset-1 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-400 flex items-center justify-center">
                    <span className="text-yellow-700 font-bold">$</span>
                  </div>
                  <div className="absolute top-1 left-1.5 w-2 h-0.5 bg-white/60 rounded-full rotate-45" />
                </div>
                <div className="absolute inset-0 rounded-full bg-yellow-400/30 blur-md -z-10" />
              </div>
            </div>
            
            <div className="absolute bottom-20 -left-6 animate-float-3d-slow">
              <div className="relative">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 shadow-lg transform rotate-20 coin-3d">
                  <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-400 flex items-center justify-center">
                    <Coins className="w-4 h-4 text-yellow-700" />
                  </div>
                </div>
                <div className="absolute inset-0 rounded-full bg-yellow-400/30 blur-sm -z-10" />
              </div>
            </div>
            
            {/* Cinema/Film Elements */}
            <div className="absolute top-8 right-0 animate-float-3d-reverse">
              <div className="relative">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600 shadow-xl transform -rotate-12 flex items-center justify-center clapboard-3d">
                  <Film className="w-7 h-7 md:w-8 md:h-8 text-white drop-shadow-lg" />
                  {/* Shine effect */}
                  <div className="absolute top-1 right-1 w-4 h-1.5 bg-white/40 rounded-full rotate-45" />
                </div>
                <div className="absolute inset-0 rounded-2xl bg-rose-500/40 blur-lg -z-10" />
              </div>
            </div>
            
            <div className="absolute bottom-32 right-0 animate-float-3d">
              <div className="relative">
                <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-purple-500 via-violet-500 to-purple-600 shadow-xl transform rotate-6 flex items-center justify-center">
                  <Play className="w-5 h-5 md:w-6 md:h-6 text-white ml-0.5" />
                </div>
                <div className="absolute inset-0 rounded-xl bg-purple-500/40 blur-md -z-10" />
              </div>
            </div>
            
            {/* Education Elements */}
            <div className="absolute top-1/3 -right-8 md:-right-12 animate-float-3d-slow">
              <div className="relative">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 shadow-xl transform rotate-12 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <div className="absolute inset-0 rounded-xl bg-blue-500/40 blur-md -z-10" />
              </div>
            </div>
            
            <div className="absolute bottom-8 right-4 animate-float-3d-delayed">
              <div className="relative">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 shadow-xl transform -rotate-6 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div className="absolute inset-0 rounded-xl bg-emerald-500/40 blur-md -z-10" />
              </div>
            </div>
            
            {/* Lightbulb - Ideas */}
            <div className="absolute top-0 left-1/3 animate-float-3d-reverse">
              <div className="relative">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 shadow-xl flex items-center justify-center lightbulb-glow">
                  <Lightbulb className="w-5 h-5 md:w-6 md:h-6 text-amber-800" />
                </div>
                <div className="absolute inset-0 rounded-full bg-amber-400/50 blur-lg -z-10 animate-pulse" />
              </div>
            </div>
            
            {/* Trophy - Achievement */}
            <div className="absolute bottom-16 left-4 animate-float-3d">
              <div className="relative">
                <div className="w-11 h-11 md:w-13 md:h-13 rounded-xl bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 shadow-xl transform rotate-6 flex items-center justify-center">
                  <Trophy className="w-5 h-5 md:w-6 md:h-6 text-amber-900" />
                </div>
                <div className="absolute inset-0 rounded-xl bg-amber-500/40 blur-md -z-10" />
              </div>
            </div>
            
            {/* Sparkles - Magic touch */}
            <div className="absolute top-24 left-8 animate-sparkle">
              <Sparkles className="w-6 h-6 text-primary drop-shadow-lg" />
            </div>
            <div className="absolute bottom-28 right-8 animate-sparkle-delayed">
              <Sparkles className="w-5 h-5 text-accent drop-shadow-lg" />
            </div>
            <div className="absolute top-1/2 -left-2 animate-sparkle-slow">
              <Sparkles className="w-4 h-4 text-yellow-400 drop-shadow-lg" />
            </div>
            
            {/* Floating particles */}
            <div className="absolute top-20 right-20 w-2 h-2 rounded-full bg-primary/60 animate-float-particle" />
            <div className="absolute bottom-24 left-16 w-1.5 h-1.5 rounded-full bg-accent/60 animate-float-particle-delayed" />
            <div className="absolute top-32 left-24 w-1 h-1 rounded-full bg-yellow-400/80 animate-float-particle-slow" />
          </div>
        </div>
        
        {/* Background 3D orbs */}
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 blur-2xl animate-pulse-slow" />
        <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-gradient-to-br from-accent/10 to-accent/5 blur-2xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-0 w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400/10 to-yellow-400/5 blur-xl animate-float-slow" />
      </div>
    </div>
  );
};

export default Hero3DScene;
