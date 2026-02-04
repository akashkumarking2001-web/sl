import { createRoot } from "react-dom/client";
import React from 'react';
import App from "./App.tsx";
import "./index.css";
import ErrorBoundary from "./components/ErrorBoundary";
import { supabase } from "@/integrations/supabase/client";

// Global Error Handler for Startup Crashes
window.onerror = function (message, source, lineno, colno, error) {
    console.error("Global Error Caught:", error);
    const errorDiv = document.createElement('div');
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '0';
    errorDiv.style.left = '0';
    errorDiv.style.width = '100%';
    errorDiv.style.backgroundColor = '#fee2e2';
    errorDiv.style.color = '#991b1b';
    errorDiv.style.padding = '20px';
    errorDiv.style.zIndex = '999999';
    errorDiv.style.fontFamily = 'monospace';
    errorDiv.innerHTML = `
        <h3 style="margin-top: 0">Application Crash</h3>
        <p><strong>Error:</strong> ${message}</p>
        <p><strong>Source:</strong> ${source}:${lineno}:${colno}</p>
        <pre style="background: rgba(255,255,255,0.5); padding: 10px; overflow: auto;">${error?.stack || 'No stack trace'}</pre>
      `;
    document.body.appendChild(errorDiv);
};

// Supabase Health Check
(async () => {
    console.log("🚀 Supabase Health Check starting...");
    const start = performance.now();
    try {
        const { error } = await supabase.from('site_settings').select('id').eq('id', 'global').maybeSingle();
        const end = performance.now();
        if (error) {
            console.error("❌ Supabase Health Check FAILED:", error.message, error);
        } else {
            console.log(`✅ Supabase Health Check PASSED: ${Math.round(end - start)}ms`);
        }
    } catch (e: any) {
        console.error("🔥 Supabase Health Check CRASHED:", e.message);
    }
})();

createRoot(document.getElementById("root")!).render(
    <ErrorBoundary>
        <App />
    </ErrorBoundary>
);
