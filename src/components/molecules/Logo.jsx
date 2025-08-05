import { cn } from "@/utils/cn";

const Logo = ({ className }) => {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
        <span className="text-white text-lg font-bold">준</span>
      </div>
      <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
        준태스쿨
      </span>
    </div>
  );
};

export default Logo;