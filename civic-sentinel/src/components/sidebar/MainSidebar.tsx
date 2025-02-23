import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Bell,
  Users,
  Bot,
  Building2,
  Menu,
  Moon,
  Sun,
  ChartLine
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/components/theme-provider";

const sidebarItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Notifications",
    icon: Bell,
    href: "/notifications",
  },
  {
    title: "Community Forum",
    icon: Users,
    href: "/community",
  },
  {
    title: "Civic Bot",
    icon: Bot,
    href: "/civic-bot",
  },
  {
    title: "Insights",
    icon: ChartLine,
    href: "/insights",
  },
];

const SidebarContent = ({ onLinkClick }: { onLinkClick?: () => void }) => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  return (
    <div className="flex h-full flex-col px-4 py-6 border-r border-gray-300">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          {/* <Menu className="h-6 w-6" /> */}
          <span className="font-semibold cursor-pointer" onClick={()=> navigate("/dashboard")}>PoliSight.AI</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="h-9 w-9 rounded-md"
        >
          {theme === "light" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Button>
      </div>
      <nav className="flex-1 space-y-2 pt-8">
        {sidebarItems.map((item) => (
          <Button
            key={item.href}
            variant={location.pathname === item.href ? "secondary" : "ghost"}
            className="w-full justify-start"
            asChild
          >
            <Link
              to={item.href}
              onClick={() => onLinkClick && onLinkClick()}
            >
              <item.icon className="mr-2 h-5 w-5" />
              {item.title}
            </Link>
          </Button>
        ))}
      </nav>
    </div>
  );
};

export function MainSidebar({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Drawer */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <SidebarContent onLinkClick={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className={cn("hidden md:block", className)}>
        <SidebarContent />
      </div>
    </>
  );
}
