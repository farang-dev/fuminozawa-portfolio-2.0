"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Remove any extension-added classes during hydration
  useEffect(() => {
    // This runs only on the client after hydration
    document.body.className = "antialiased light";

    // Update html lang attribute
    const isJa = pathname?.startsWith('/ja');
    document.documentElement.lang = isJa ? 'ja' : 'en';
  }, [pathname]);

  return <div className="antialiased">{children}</div>;
}
