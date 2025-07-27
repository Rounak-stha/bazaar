"use client";

import { StoreIcon } from "lucide-react";
import { usePathname } from "next/navigation";

export const AdminNavbarHeader = () => {
  const pathname = usePathname();

  return (
    <div className="mb-2.5 flex items-center py-2">
      <div className="mr-2 flex items-center justify-center rounded-md bg-blue-500 p-1.5">
        <StoreIcon width={24} height={24} className="text-primary" />
      </div>
      {pathname === "/admin" && <div className="nav__link-indicator"></div>}
      <div>
        <p className="text-xl">Bazaar</p>
        <p className="text-muted-foreground text-sm">Admin Panel</p>
      </div>
    </div>
  );
};
