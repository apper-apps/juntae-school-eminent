import { useAuth } from "@/hooks/useAuth";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import PlaceholderCard from "@/components/molecules/PlaceholderCard";

const HomePage = () => {
  const { user, openAuthModal } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <span className="text-white text-3xl font-bold">준</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-slate-100 mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
              준태스쿨
            </span>
          </h1>
          
          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            체계적인 한국어 학습과 함께하는 여러분의 성장 파트너
          </p>
          
          {!user && (
            <Button size="lg" onClick={openAuthModal} className="mb-12">
              <ApperIcon name="Play" size={20} className="mr-2" />
              학습 시작하기
            </Button>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          <Card className="p-6 hover:scale-[1.02] transition-transform duration-200">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
              <ApperIcon name="Video" size={20} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-100 mb-3">멤버십 영상실</h3>
            <p className="text-slate-400 leading-relaxed">
              전문가가 제작한 고품질 영상 콘텐츠로 체계적인 학습을 경험하세요.
            </p>
          </Card>

          <Card className="p-6 hover:scale-[1.02] transition-transform duration-200">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mb-4">
              <ApperIcon name="Crown" size={20} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-100 mb-3">마스터 과정</h3>
            <p className="text-slate-400 leading-relaxed">
              심화 과정을 통해 한국어 실력을 한 단계 더 발전시켜보세요.
            </p>
          </Card>

          <Card className="p-6 hover:scale-[1.02] transition-transform duration-200">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
              <ApperIcon name="TrendingUp" size={20} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-100 mb-3">머니 인사이트</h3>
            <p className="text-slate-400 leading-relaxed">
              한국어와 함께 배우는 실용적인 경제 지식과 인사이트.
            </p>
          </Card>
        </div>
      </section>

      {/* Welcome Message for Logged In Users */}
      {user && (
        <section className="container mx-auto px-4 py-8">
          <Card className="p-8 text-center bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-blue-500/20">
            <h2 className="text-2xl font-semibold text-slate-100 mb-4">
              환영합니다, {user.name}님! 🎉
            </h2>
            <p className="text-slate-300 mb-6">
              현재 회원 등급: <span className="font-medium text-blue-400">{user.role}</span>
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="text-center">
                <p className="text-sm text-slate-400">멤버십 코호트</p>
                <p className="text-lg font-semibold text-slate-200">{user.membership_cohort}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-400">마스터 코호트</p>
                <p className="text-lg font-semibold text-slate-200">{user.master_cohort}</p>
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* Main Content */}
      <section className="container mx-auto px-4 py-16">
        <PlaceholderCard 
          title="홈 페이지 준비 중입니다..."
          description="더 많은 학습 콘텐츠와 기능으로 곧 돌아오겠습니다!"
        />
      </section>
    </div>
  );
};

export default HomePage;