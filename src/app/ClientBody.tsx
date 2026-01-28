"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Handle loading overlay - only hide it once on initial mount
  useEffect(() => {
    const loadingOverlay = document.querySelector('.loading-overlay') as HTMLElement;
    if (loadingOverlay) {
      const timer = setTimeout(() => {
        loadingOverlay.style.opacity = '0';
        loadingOverlay.style.visibility = 'hidden';
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Remove any extension-added classes during hydration and update lang
  useEffect(() => {
    // This runs only on the client after hydration
    document.body.className = "antialiased light";

    // Update html lang attribute
    const isJa = pathname?.startsWith('/ja');
    document.documentElement.lang = isJa ? 'ja' : 'en';
  }, [pathname]);

  return (
    <div className="antialiased">
      <div className="loading-overlay">
        <div className="loading-spinner">F</div>
      </div>
      {children}
    </div>
  );
}
