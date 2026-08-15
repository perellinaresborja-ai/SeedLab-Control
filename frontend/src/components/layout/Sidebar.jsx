import { LayoutDashboard, Dna, Package, Beaker, ShieldCheck, Settings, CheckSquare, Receipt, Truck, Network, AlertCircle, Server, Store } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import { useAppContext } from "../../context/AppContext";

export function Sidebar() {
  const location = useLocation();
  const { currentUser, subscriptionTier } = useAppContext();

  const NAV_ITEMS = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard, roles: ["Admin", "Quality Manager", "Lab Technician"], tiers: ["Lite", "Producer", "Enterprise"] },
    { name: "Catalog", path: "/catalog", icon: Dna, roles: ["Admin", "Quality Manager", "Lab Technician"], tiers: ["Lite", "Producer", "Enterprise"] },
    { name: "Genetics Engine", path: "/genetics", icon: Network, roles: ["Admin", "Quality Manager", "Lab Technician"], tiers: ["Enterprise"] },
    { name: "Inventory", path: "/inventory", icon: Package, roles: ["Admin", "Quality Manager", "Lab Technician"], tiers: ["Lite", "Producer", "Enterprise"] },
    { name: "Lab & Testing", path: "/lab", icon: Beaker, roles: ["Admin", "Quality Manager", "Lab Technician"], tiers: ["Producer", "Enterprise"] },
    { name: "Quality Agreements", path: "/quality-agreements", icon: ShieldCheck, roles: ["Admin", "Quality Manager"], tiers: ["Enterprise"] },
    { name: "Quality Events", path: "/quality-events", icon: AlertCircle, roles: ["Admin", "Quality Manager", "Lab Technician"], tiers: ["Producer", "Enterprise"] },
    { name: "Sales & Invoicing", path: "/sales", icon: Receipt, roles: ["Admin", "Quality Manager"], tiers: ["Lite", "Producer", "Enterprise"] },
    { name: "Logistics & Shipping", path: "/logistics", icon: Truck, roles: ["Admin", "Quality Manager"], tiers: ["Lite", "Producer", "Enterprise"] },
    { name: "Facilities & Vaults", path: "/facilities", icon: Server, roles: ["Admin", "Quality Manager"], tiers: ["Producer", "Enterprise"] },
    { name: "Acquisitions & B2B", path: "/acquisitions", icon: Store, roles: ["Admin", "Quality Manager"], tiers: ["Producer", "Enterprise"] },
    { name: "Tasks", path: "/tasks", icon: CheckSquare, roles: ["Admin", "Quality Manager", "Lab Technician"], tiers: ["Lite", "Producer", "Enterprise"] },
    { name: "Settings", path: "/settings", icon: Settings, roles: ["Admin"], tiers: ["Lite", "Producer", "Enterprise"] },
  ];

  return (
    <aside className="w-64 h-screen border-r border-border bg-card/50 backdrop-blur-xl flex flex-col fixed left-0 top-0 z-20">
      <div className="h-24 flex items-center justify-center border-b border-border px-4 py-2">
        <img src="/logo.png" alt="SeedLab Logo" className="w-full h-full object-contain" />
      </div>
      
      <nav className="flex-1 py-6 px-4 space-y-2">
        {NAV_ITEMS.map((item) => {
          if (item.roles && currentUser && !item.roles.includes(currentUser.role)) return null;
          if (item.tiers && subscriptionTier && !item.tiers.includes(subscriptionTier)) return null;
          
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-4 py-3 rounded-lg transition-all duration-200 group relative",
                isActive 
                  ? "bg-primary-green/10 text-primary-green" 
                  : "text-text-muted hover:bg-white/5 hover:text-white"
              )}
            >
              {isActive && (
                <div className="absolute left-0 w-1 h-full bg-primary-green rounded-r-full shadow-[0_0_10px_#10b981]" />
              )}
              <item.icon className={cn("w-5 h-5 mr-3", isActive ? "text-primary-green" : "group-hover:text-primary-cyan transition-colors")} />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="bg-background rounded-lg p-3 text-xs text-text-muted border border-border/50">
          <p className="flex justify-between mb-1"><span>System Status:</span> <span className="text-primary-green">Online</span></p>
          <p className="flex justify-between"><span>Version:</span> <span>v2.1.0-sec</span></p>
        </div>
      </div>
    </aside>
  );
}
