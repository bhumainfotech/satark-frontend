"use client";

import { useEffect, useState } from "react";
import "@/i18n"; // Import i18n config

export default function I18nProvider({ children }: { children: React.ReactNode }) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null; // Avoid hydration mismatch for now

    return <>{children}</>;
}
