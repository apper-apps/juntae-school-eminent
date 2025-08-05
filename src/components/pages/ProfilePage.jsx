import { useAuth } from "@/hooks/useAuth";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import PlaceholderCard from "@/components/molecules/PlaceholderCard";

const ProfilePage = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950">
        <div className="container mx-auto px-4 py-16">
          <PlaceholderCard 
            title="로그인이 필요합니다"
            description="프로필을 보려면 먼저 로그인해 주세요."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
              프로필
            </h1>
            <p className="text-slate-400 text-lg">
              내 학습 정보를 관리하세요
            </p>
          </div>

          <Card className="p-8 mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <ApperIcon name="User" size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-100">{user.name}</h2>
                <p className="text-slate-400">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">회원 등급</label>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                    {user.role}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">관리자 권한</label>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.is_admin 
                      ? "bg-green-500/20 text-green-400" 
                      : "bg-slate-500/20 text-slate-400"
                  }`}>
                    {user.is_admin ? "예" : "아니오"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">멤버십 코호트</label>
                <p className="text-slate-100 font-semibold">{user.membership_cohort}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">마스터 코호트</label>
                <p className="text-slate-100 font-semibold">{user.master_cohort}</p>
              </div>
            </div>

            <div className="space-y-2 mb-8">
              <label className="text-sm font-medium text-slate-300">가입일</label>
              <p className="text-slate-400">
                {new Date(user.created_at).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" className="flex-1">
                <ApperIcon name="Edit" size={16} className="mr-2" />
                프로필 편집
              </Button>
              <Button variant="outline" onClick={logout} className="flex-1">
                <ApperIcon name="LogOut" size={16} className="mr-2" />
                로그아웃
              </Button>
            </div>
          </Card>

          <PlaceholderCard 
            title="추가 프로필 기능 준비 중입니다..."
            description="학습 통계, 진도 관리, 설정 등 더 많은 기능을 준비하고 있습니다."
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;