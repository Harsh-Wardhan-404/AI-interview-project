import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Home, FileText, Settings, LogOut, Menu } from "lucide-react";

function DashboardLayout() {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);

  const sidebarLinks = [
    { icon: <Home size={20} />, label: "Overview", path: "/dashboard" },
    { icon: <FileText size={20} />, label: "Reports", path: "/reports" },
    { icon: <Settings size={20} />, label: "Settings", path: "/settings" },
  ];

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          isExpanded ? "w-64" : "w-20"
        } bg-white shadow-lg hidden md:block transition-all duration-300 ease-in-out fixed h-[calc(100vh-64px)] top-16`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 mt-4 flex items-center justify-between">
            <h2
              className={`text-2xl font-bold text-brand-blue ${
                !isExpanded && "hidden"
              }`}
            >
              Dashboard
            </h2>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu size={20} className="text-gray-600" />
            </button>
          </div>

          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {sidebarLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.path}
                    className="flex items-center space-x-3 text-gray-600 p-3 rounded-lg hover:bg-gray-50 hover:text-brand-blue transition-colors"
                  >
                    {link.icon}
                    <span className={!isExpanded ? "hidden" : ""}>
                      {link.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t">
            <button className="flex items-center space-x-3 text-gray-600 w-full p-3 rounded-lg hover:bg-gray-50 hover:text-brand-red transition-colors">
              <LogOut size={20} />
              <span className={!isExpanded ? "hidden" : ""}>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          !isExpanded ? "ml-20" : "ml-64"
        } mt-16`}
      >
        <div className="h-[calc(100vh-64px)] overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;