import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import CreatePage from "./pages/CreatePage";
import TrendsPage from "./pages/TrendsPage";
import GalleryPage from "./pages/GalleryPage";
import ProfilePage from "./pages/ProfilePage";

const NAV = [
  { to: "/create", label: "Create", icon: "✦" },
  { to: "/trends", label: "Trends", icon: "⚡" },
  { to: "/gallery", label: "Gallery", icon: "▦" },
  { to: "/profile", label: "Profile", icon: "◐" },
];

function NavItem({ to, label, icon, variant }: { to: string; label: string; icon: string; variant: "side" | "bottom" }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        variant === "side"
          ? `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
              isActive ? "bg-ember-500/15 text-ember-400" : "text-mist-300 hover:bg-white/5 hover:text-white"
            }`
          : `flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium transition-colors ${
              isActive ? "text-ember-400" : "text-mist-500"
            }`
      }
    >
      <span className={variant === "side" ? "text-base" : "text-lg leading-none"}>{icon}</span>
      {label}
    </NavLink>
  );
}

export default function App() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-6xl">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh w-56 shrink-0 flex-col gap-1 border-r border-white/5 p-4 md:flex">
        <div className="mb-6 flex items-center gap-2.5 px-2 pt-2">
          <img src="/icon.svg" alt="" className="h-9 w-9 rounded-xl" />
          <div>
            <div className="text-sm font-bold text-white">TrendForge UGC</div>
            <div className="text-[10px] text-mist-500">Ride the trend before it peaks</div>
          </div>
        </div>
        {NAV.map((n) => (
          <NavItem key={n.to} {...n} variant="side" />
        ))}
        <div className="mt-auto px-2 pb-2 text-[10px] leading-relaxed text-mist-500">
          Formats adapted, never copied. Renders use licensed / royalty-free audio only.
        </div>
      </aside>

      {/* Main content */}
      <main className="min-w-0 flex-1 px-4 pb-24 pt-6 md:px-8 md:pb-10">
        <div className="mb-4 flex items-center gap-2 md:hidden">
          <img src="/icon.svg" alt="" className="h-8 w-8 rounded-lg" />
          <span className="text-sm font-bold text-white">TrendForge UGC</span>
        </div>
        <Routes>
          <Route path="/" element={<Navigate to="/create" replace />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/trends" element={<TrendsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/create" replace />} />
        </Routes>
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-white/10 bg-ink-900/95 backdrop-blur md:hidden">
        {NAV.map((n) => (
          <NavItem key={n.to} {...n} variant="bottom" />
        ))}
      </nav>
    </div>
  );
}
