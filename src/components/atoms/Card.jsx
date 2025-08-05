import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border border-slate-700 bg-slate-800/50 backdrop-blur-sm shadow-lg shadow-slate-900/10 transition-all duration-200 hover:shadow-xl hover:shadow-slate-900/20 hover:border-slate-600",
        className
      )}
      {...props}
    />
  );
});

Card.displayName = "Card";

export default Card;