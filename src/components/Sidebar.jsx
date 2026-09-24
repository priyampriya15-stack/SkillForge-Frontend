import { NavLink } from "react-router-dom";
import {
  FaChartPie,
  FaBriefcase,
  FaFileLines,
  FaRocket,
  FaMessage,
  FaUser,
  FaGear,
  FaCircleQuestion,
  FaArrowRightFromBracket,
  FaPlus,
} from "react-icons/fa6";

const Sidebar = () => {
  const menuItems = [
    {
      label: "Dashboard",
      path: "/freelancer/dashboard",
      icon: <FaChartPie />,
    },
    {
      label: "Browse Projects",
      path: "/browse-projects",
      icon: <FaBriefcase />,
    },
    {
      label: "My Applications",
      path: "/my-applications",
      icon: <FaFileLines />,
    },
    {
      label: "Active Projects",
      path: "/active-projects",
      icon: <FaRocket />,
    },
    {
      label: "Messages",
      path: "/messages",
      icon: <FaMessage />,
    },
  ];

  return (
    <aside className="hidden lg:flex w-64 min-h-[calc(100vh-72px)] flex-col border-r border-white/10 bg-slate-950/95 px-4 py-6">

      {/* Profile */}
      <div className="mb-7 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold">
            PS
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              Priya S
            </p>
            <p className="text-xs text-slate-400">
              Freelancer
            </p>
          </div>
        </div>

        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
        </div>

        <div className="mt-2 flex justify-between text-[11px]">
          <span className="text-slate-500">
            Profile completion
          </span>
          <span className="font-medium text-indigo-400">
            78%
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <div>
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
          Workspace
        </p>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-indigo-500/15 text-indigo-400 shadow-lg shadow-indigo-950/20"
                    : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
                }`
              }
            >
              <span className="text-base">
                {item.icon}
              </span>

              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Account */}
      <div className="mt-8">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
          Account
        </p>

        <nav className="space-y-1">
          <NavLink
            to="/profile"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
          >
            <FaUser />
            Profile
          </NavLink>

          <NavLink
            to="/settings"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
          >
            <FaGear />
            Settings
          </NavLink>
        </nav>
      </div>

      {/* Bottom Help */}
      <div className="mt-auto">

        <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-violet-500/5 p-4">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400">
            <FaCircleQuestion />
          </div>

          <h4 className="text-sm font-semibold text-white">
            Need help?
          </h4>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Get tips to improve your profile and win more projects.
          </p>

          <button className="mt-3 text-xs font-semibold text-indigo-400 hover:text-indigo-300">
            Visit Help Center →
          </button>
        </div>

        <button className="mt-4 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-500 transition hover:bg-red-500/10 hover:text-red-400">
          <FaArrowRightFromBracket />
          Logout
        </button>

      </div>
    </aside>
  );
};

export default Sidebar;