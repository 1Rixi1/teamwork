import React from "react";
import NavigationSidebar from "@/components/navigation/navigation-sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div className="hidden md:flex flex-col h-full w-[72px] fixed inset-y-0 z-30">
        <NavigationSidebar />
      </div>

      <main className="md:pl-[72px]">{children}</main>
    </div>
  );
};

export default Layout;
