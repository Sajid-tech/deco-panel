import React from "react";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";

const Layout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="min-h-screen">
     
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-gray-900/90 p-2 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center mr-2">
            <span className="text-white font-bold text-sm">DP</span>
          </div>
          <span className="text-white font-semibold">Deco Panel</span>
        </div>
        <button
          onClick={toggleMobileSidebar}
          className="text-gray-400 hover:text-white p-2"
        >
          <Menu size={24} />
        </button>
      </div>

      <Sidebar
        isCollapsed={isSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        toggleSidebar={toggleSidebar}
      />

      <div
        className={`flex flex-col transition-all duration-200 ${
          isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
     
        <main className="flex-1 mt-14 lg:mt-0 p-0">
          <div className="bg-blue-500/20 min-h-screen p-2">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;