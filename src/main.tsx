import { createRoot } from "react-dom/client";
import React from 'react';
import App from "./App.tsx";
import "./index.css";

// Global Error Handler for Startup Crashes
window.onerror = function (message, source, lineno, colno, error) {
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
    console.error("Global Error Caught:", error);
};

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: 20, color: 'red' }}>
                    <h1>Something went wrong.</h1>
                    <pre>{this.state.error?.toString()}</pre>
                </div>
            );
        }
        return this.props.children;
    }
}

createRoot(document.getElementById("root")!).render(
    <ErrorBoundary>
        <App />
    </ErrorBoundary>
);
