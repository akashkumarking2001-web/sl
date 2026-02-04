import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('🔥 Error caught by boundary:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
                    <div className="max-w-md w-full text-center space-y-6 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl">
                        <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/20 rounded-full flex items-center justify-center mx-auto text-rose-600">
                            <AlertTriangle className="w-10 h-10" />
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Oops!</h1>
                            <p className="text-slate-500 dark:text-slate-400 font-medium">Something went wrong while rendering this page.</p>
                        </div>

                        {this.state.error && (
                            <div className="bg-rose-50 dark:bg-rose-900/10 p-4 rounded-2xl border border-rose-100 dark:border-rose-900/20 text-xs font-mono text-rose-700 dark:text-rose-400 text-left overflow-auto max-h-40">
                                {this.state.error.toString()}
                            </div>
                        )}

                        <div className="flex flex-col gap-3">
                            <Button
                                onClick={() => window.location.reload()}
                                className="h-14 rounded-2xl font-black text-lg bg-[#FBBF24] text-black hover:bg-[#FBBF24]/90 w-full shadow-lg shadow-[#FBBF24]/20"
                            >
                                <RefreshCw className="w-5 h-5 mr-2" /> Reload Page
                            </Button>
                            <Button
                                onClick={() => {
                                    localStorage.clear();
                                    sessionStorage.clear();
                                    window.location.href = '/';
                                }}
                                variant="ghost"
                                className="h-12 rounded-2xl font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50 w-full"
                            >
                                Reset App (Clear Cache)
                            </Button>
                            <Button
                                onClick={() => window.location.href = '/'}
                                variant="outline"
                                className="h-14 rounded-2xl font-bold text-slate-600 dark:text-slate-400 w-full"
                            >
                                <Home className="w-5 h-5 mr-2" /> Back to Home
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
