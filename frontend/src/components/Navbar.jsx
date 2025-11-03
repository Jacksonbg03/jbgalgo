import { Link, useLocation } from "react-router";
import { BookOpenIcon, LayoutDashboardIcon, Presentation, SparklesIcon } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
import logo from "../../public/logo.png";

function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-base-100/80 backdrop-blur-md border-b border-primary/20 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
        {/* LOGO */}
        <Link
          to="/"
          className="group flex items-center gap-3 hover:scale-105 transition-transform duration-200"
        >
          <div className=" w-full flex items-center">
            <img src={logo} alt="" className="min-w-[30px] w-[30px] h-[30px] rotate"/>
          </div>

          <div className="flex flex-col">
            <span className="font-black text-xl bg-gradient-to-r from-primary via-[#FF7F50] via-[##FF6F00] to-[#FFC107] bg-clip-text text-transparent tracking-wider">
              JBGAlgo
            </span>
            <span className="text-xs text-base-content/60 font-medium -mt-1">Build Together</span>
          </div>
        </Link>

        <div className="flex items-center gap-1">
          {/* PROBLEMS PAGE LINK */}
          <Link
            to={"/problems"}
            className={`px-4 py-2.5 rounded-lg transition-all duration-200 
              ${
                isActive("/problems")
                  ? "bg-primary text-primary-content"
                  : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
              }
              
              `}
          >
            <div className="flex items-center gap-x-2.5">
              <BookOpenIcon className="size-4" />
              <span className="font-medium hidden sm:inline">Problems</span>
            </div>
          </Link>

          <Link
            to={"/sessions"}
            className={`px-4 py-2.5 rounded-lg transition-all duration-200 
              ${
                isActive("/sessions")
                  ? "bg-primary text-primary-content"
                  : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
              }

              `}
          >
            <div className="flex items-center gap-x-2.5">
              <Presentation className="size-4" />
              <span className="font-medium hidden sm:inline">Sessions</span>
            </div>
          </Link>

          {/* DASHBORD PAGE LINK */}
          <Link
            to={"/dashboard"}
            className={`px-4 py-2.5 rounded-lg transition-all duration-200 
              ${
                isActive("/dashboard")
                  ? "bg-primary text-primary-content"
                  : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
              }
              
              `}
          >
            <div className="flex items-center gap-x-2.5">
              <LayoutDashboardIcon className="size-4" />
              <span className="font-medium hidden sm:inline">Dashboard</span>
            </div>
          </Link>

          <div className="ml-4 mt-2">
            <UserButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
