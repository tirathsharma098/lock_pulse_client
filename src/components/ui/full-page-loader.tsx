"use client";

import { Loader2 } from "lucide-react";

export default function FullPageSpinner() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <svg width="0" height="0">
            <defs>
                <linearGradient id="spinner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#cc66ff" />
                </linearGradient>
            </defs>
            </svg>

            <Loader2
            className="h-12 w-12 animate-spin"
            style={{ stroke: "url(#spinner-gradient)" }}
            />
        </div>
    );
}