import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";

const NavItem = ({ to, children, className, onClick }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-slate-800/50 hover:text-blue-400 active:scale-[0.98]",
          isActive 
            ? "text-blue-400 bg-slate-800/50 shadow-sm" 
            : "text-slate-300",
          className
        )
      }
    >
      {children}
    </NavLink>
  );
};

export default NavItem;