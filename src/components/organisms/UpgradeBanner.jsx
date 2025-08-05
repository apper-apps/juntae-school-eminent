import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const UpgradeBanner = () => {
  const { user, openAuthModal } = useAuth();
  const location = useLocation();

  // Define which routes require authentication
  const protectedRoutes = {
    "/membership": { type: "membership", label: "멤버십 영상실" },
    "/master": { type: "master", label: "마스터 과정" },
    "/money-insight": { type: "premium", label: "머니 인사이트" },
    "/profile": { type: "auth", label: "프로필" }
  };

  const currentRoute = protectedRoutes[location.pathname];
  
  // Don't show banner if route doesn't require auth or user has access
  if (!currentRoute) return null;
  
  // Show banner if user is not logged in for any protected route
  const shouldShowBanner = !user || (
    currentRoute.type === "membership" && user.membership_cohort === 0
  ) || (
    currentRoute.type === "master" && user.master_cohort === 0
  ) || (
    currentRoute.type === "premium" && user.role === "free"
  );

  if (!shouldShowBanner) return null;

  const getBannerContent = () => {
    if (!user) {
      return {
        title: "로그인이 필요합니다",
        description: `${currentRoute.label}에 접근하려면 로그인해 주세요.`,
        buttonText: "로그인하기",
        action: openAuthModal
      };
    }

    switch (currentRoute.type) {
      case "membership":
        return {
          title: "멤버십 업그레이드 필요",
          description: "멤버십 영상실에 접근하려면 멤버십 업그레이드가 필요합니다.",
          buttonText: "멤버십 업그레이드",
          action: () => console.log("Upgrade to membership")
        };
      case "master":
        return {
          title: "마스터 과정 등록 필요",
          description: "마스터 과정에 접근하려면 과정 등록이 필요합니다.",
          buttonText: "마스터 과정 등록",
          action: () => console.log("Enroll in master course")
        };
      case "premium":
        return {
          title: "프리미엄 업그레이드 필요",
          description: "머니 인사이트에 접근하려면 프리미엄 업그레이드가 필요합니다.",
          buttonText: "프리미엄 업그레이드",
          action: () => console.log("Upgrade to premium")
        };
      default:
        return {
          title: "업그레이드가 필요합니다",
          description: "이 콘텐츠에 접근하려면 업그레이드가 필요합니다.",
          buttonText: "업그레이드하기",
          action: () => console.log("Generic upgrade")
        };
    }
  };

  const bannerContent = getBannerContent();

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl shadow-2xl shadow-slate-900/50 p-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name="Lock" size={24} className="text-white" />
        </div>
        
        <h3 className="text-xl font-semibold text-slate-100 mb-3">
          {bannerContent.title}
        </h3>
        
        <p className="text-slate-400 mb-6 leading-relaxed">
          {bannerContent.description}
        </p>
        
        <Button 
          onClick={bannerContent.action}
          variant="amber"
          className="w-full"
        >
          {bannerContent.buttonText}
        </Button>
      </div>
    </div>
  );
};

export default UpgradeBanner;