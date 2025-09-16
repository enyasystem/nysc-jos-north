import React from "react";
import AdminNavigation from "./admin-navigation";
import AdminFooter from "./admin-footer";

interface Props {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: Props) {
  return (
  <div className="admin-root min-h-screen text-white" style={{ backgroundColor: '#014f43' }}>
      <AdminNavigation />
      <main id="main-content" className="pt-20 px-4 md:px-8">
        {children}
      </main>
      <AdminFooter />
    </div>
  );
}
