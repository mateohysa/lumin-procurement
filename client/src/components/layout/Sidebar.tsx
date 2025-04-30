
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";
import { 
  Folder, 
  Home, 
  FileText, 
  Award, 
  Users, 
  Settings, 
  BarChart3,
  Search
} from "lucide-react";

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  active?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  to,
  icon,
  text,
  active = false,
}) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
      )}
    >
      {React.cloneElement(icon as React.ReactElement, {
        className: "h-4 w-4",
        strokeWidth: 2,
      })}
      <span>{text}</span>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  const isAdmin = user?.role === "admin";
  const isVendor = user?.role === "vendor";

  return (
    <div className="w-64 bg-sidebar h-screen sticky top-0 flex flex-col border-r border-sidebar-border overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="bg-primary h-8 w-8 rounded-md flex items-center justify-center">
            <span className="text-primary-foreground font-bold">U</span>
          </div>
          <div>
            <h3 className="font-bold text-sidebar-foreground text-lg leading-tight">UMT</h3>
            <p className="text-xs text-sidebar-foreground/70">Procurement Portal</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 px-3 py-2 space-y-1">
        <SidebarLink
          to="/"
          icon={<Home />}
          text="Dashboard"
          active={location.pathname === "/"}
        />
        <SidebarLink
          to="/tenders"
          icon={<Folder />}
          text="Tenders"
          active={location.pathname.startsWith("/tenders")}
        />
        {!isVendor && (
          <SidebarLink
            to="/proposals"
            icon={<FileText />}
            text="Proposals"
            active={location.pathname.startsWith("/proposals")}
          />
        )}
        {isVendor && (
          <SidebarLink
            to="/my-proposals"
            icon={<FileText />}
            text="My Proposals"
            active={location.pathname.startsWith("/my-proposals")}
          />
        )}
        {!isVendor && (
          <SidebarLink
            to="/decisions"
            icon={<Award />}
            text="Decisions"
            active={location.pathname.startsWith("/decisions")}
          />
        )}
        {isAdmin && (
          <SidebarLink
            to="/vendors"
            icon={<Users />}
            text="Vendors"
            active={location.pathname.startsWith("/vendors")}
          />
        )}
        {!isVendor && (
          <SidebarLink
            to="/reports"
            icon={<BarChart3 />}
            text="Reports"
            active={location.pathname.startsWith("/reports")}
          />
        )}
        <SidebarLink
          to="/search"
          icon={<Search />}
          text="Search Archive"
          active={location.pathname.startsWith("/search")}
        />
      </nav>
      
      {isAdmin && (
        <div className="p-3 mt-auto">
          <SidebarLink
            to="/settings"
            icon={<Settings />}
            text="Settings"
            active={location.pathname.startsWith("/settings")}
          />
        </div>
      )}
      
      <div className="p-4 border-t border-sidebar-border">
        <div className="bg-sidebar-accent rounded-md p-3">
          <h4 className="text-xs font-medium text-sidebar-foreground mb-1">Need Help?</h4>
          <p className="text-xs text-sidebar-foreground/70">
            View our <Link to="/help" className="text-primary-foreground hover:underline">documentation</Link> or contact support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
