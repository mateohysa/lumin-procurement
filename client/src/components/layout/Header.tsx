
import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/button";
import { Bell, Search, LogOut } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "../../components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "../theme/ThemeToggle";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-background border-b border-border h-16 flex items-center px-6 sticky top-0 z-10">
      <div className="flex-1 flex items-center">
        <div className="font-semibold text-foreground text-lg mr-4">
          Procurement Nexus
        </div>
        <div className="hidden md:flex rounded-md px-3 py-1.5 flex-1 max-w-md items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search tenders, proposals..." 
              className="pl-8 w-full"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <ThemeToggle />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full"></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="px-4 py-2 font-medium border-b">
              Notifications
            </div>
            <DropdownMenuItem className="py-2 px-4 cursor-default">
              <div>
                <p className="font-medium text-sm">New Proposal Received</p>
                <p className="text-xs text-muted-foreground mt-1">
                  A new proposal has been submitted for Training and Development Services tender
                </p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="py-2 px-4 cursor-default">
              <div>
                <p className="font-medium text-sm">Tender Deadline Approaching</p>
                <p className="text-xs text-muted-foreground mt-1">
                  The IT System Implementation tender closes in 3 days
                </p>
              </div>
            </DropdownMenuItem>
            <Separator />
            <div className="p-2">
              <Button variant="ghost" size="sm" className="w-full">View all notifications</Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center">
          <div className="mr-3 hidden md:block text-right">
            <p className="text-sm font-medium">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-muted-foreground">
              {user?.role?.charAt(0).toUpperCase() + (user?.role?.slice(1) || "")}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="py-2 cursor-default md:hidden">
                <div>
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="py-2" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
