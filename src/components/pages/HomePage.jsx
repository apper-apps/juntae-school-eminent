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
              당신의 글쓰기가 인생을 바꾼다
            </span>
          </h1>
          
          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            텍스트 인플루언서가 되는 가장 빠른 방법
          </p>
          
<div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" onClick={() => window.location.href = '/membership'} className="bg-blue-600 hover:bg-blue-700">
              무료 체험하기
            </Button>
            <Button size="lg" variant="outline" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
              커리큘럼 보기
            </Button>
          </div>
        </div>

{/* Features Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          <Card className="p-6 hover:scale-[1.02] transition-transform duration-200">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
              <ApperIcon name="Video" size={20} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-100 mb-3">회원 영상실</h3>
            <p className="text-slate-400 leading-relaxed">
              전문가의 글쓰기 노하우를 담은 프리미엄 영상 콘텐츠
            </p>
          </Card>

          <Card className="p-6 hover:scale-[1.02] transition-transform duration-200">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mb-4">
              <ApperIcon name="Crown" size={20} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-100 mb-3">마스터 과정</h3>
            <p className="text-slate-400 leading-relaxed">
              글쓰기 전문가로 성장하는 체계적인 마스터 클래스
            </p>
          </Card>

          <Card className="p-6 hover:scale-[1.02] transition-transform duration-200">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
              <ApperIcon name="TrendingUp" size={20} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-100 mb-3">실전 머니 인사이트</h3>
            <p className="text-slate-400 leading-relaxed">
              글쓰기로 수익을 창출하는 실전 전략과 비즈니스 인사이트
            </p>
          </Card>

          <Card className="p-6 hover:scale-[1.02] transition-transform duration-200">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
              <ApperIcon name="Users" size={20} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-100 mb-3">라이브 리뷰</h3>
            <p className="text-slate-400 leading-relaxed">
              실시간으로 진행되는 글쓰기 피드백과 개선 세션
            </p>
          </Card>

          <Card className="p-6 hover:scale-[1.02] transition-transform duration-200">
            <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center mb-4">
              <ApperIcon name="MessageCircle" size={20} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-100 mb-3">1:1 코칭</h3>
            <p className="text-slate-400 leading-relaxed">
              개인 맞춤형 글쓰기 멘토링과 집중 코칭 프로그램
            </p>
          </Card>

          <Card className="p-6 hover:scale-[1.02] transition-transform duration-200">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mb-4">
              <ApperIcon name="Heart" size={20} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-100 mb-3">커뮤니티</h3>
            <p className="text-slate-400 leading-relaxed">
              같은 목표를 가진 글쓰기 동료들과의 활발한 소통 공간
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

{/* Testimonials Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
            성공한 수강생들의 이야기
          </h2>
          <p className="text-xl text-slate-300">
            글쓰기로 인생을 바꾼 실제 후기들을 만나보세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">김</span>
              </div>
              <div className="ml-3">
                <p className="font-semibold text-slate-100">김지은님</p>
                <p className="text-sm text-slate-400">브랜딩 컨설턴트</p>
              </div>
            </div>
            <p className="text-slate-300 leading-relaxed mb-4">
              "글쓰기가 이렇게 체계적으로 배울 수 있는 줄 몰랐어요. 3개월 만에 개인 브랜딩으로 월 수익 500만원을 달성했습니다."
            </p>
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <ApperIcon key={i} name="Star" size={16} className="fill-current" />
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">박</span>
              </div>
              <div className="ml-3">
                <p className="font-semibold text-slate-100">박민수님</p>
                <p className="text-sm text-slate-400">콘텐츠 크리에이터</p>
              </div>
            </div>
            <p className="text-slate-300 leading-relaxed mb-4">
              "뭔가 막연했던 글쓰기가 명확한 전략이 되었어요. 이제 글 하나로 수만 명의 마음을 움직일 수 있습니다."
            </p>
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <ApperIcon key={i} name="Star" size={16} className="fill-current" />
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">이</span>
              </div>
              <div className="ml-3">
                <p className="font-semibold text-slate-100">이소영님</p>
                <p className="text-sm text-slate-400">온라인 사업가</p>
              </div>
            </div>
            <p className="text-slate-300 leading-relaxed mb-4">
              "글쓰기 실력이 늘면서 비즈니스도 성장했어요. 고객과의 소통이 달라지니 매출도 2배 이상 증가했습니다."
            </p>
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <ApperIcon key={i} name="Star" size={16} className="fill-current" />
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/50 border-t border-slate-800">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-3">
                  <span className="text-white text-lg font-bold">준</span>
                </div>
                <span className="text-xl font-bold text-slate-100">준태스쿨</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                글쓰기로 인생을 바꾸는<br />
                텍스트 인플루언서 양성 스쿨
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-100 mb-4">회사 정보</h4>
              <div className="space-y-2 text-slate-400 text-sm">
                <p>사업자등록번호: 123-45-67890</p>
                <p>대표자: 준태</p>
                <p>주소: 서울시 강남구 테헤란로 123</p>
                <p>이메일: contact@juntaeschool.com</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-100 mb-4">고객센터</h4>
              <div className="space-y-2 text-slate-400 text-sm">
                <p>운영시간: 평일 09:00 - 18:00</p>
                <p>점심시간: 12:00 - 13:00</p>
                <p>주말/공휴일 휴무</p>
                <p>전화: 02-1234-5678</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-100 mb-4">소셜 미디어</h4>
              <div className="flex space-x-4">
                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center hover:bg-red-700 transition-colors"
                >
                  <ApperIcon name="Youtube" size={20} className="text-white" />
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-colors"
                >
                  <ApperIcon name="Instagram" size={20} className="text-white" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-8 text-center">
            <p className="text-slate-400 text-sm">
              © 2024 준태스쿨. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;