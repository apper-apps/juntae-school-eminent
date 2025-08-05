import PlaceholderCard from "@/components/molecules/PlaceholderCard";

const MembershipPage = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
            멤버십 영상실
          </h1>
          <p className="text-slate-400 text-lg">
            프리미엄 영상 콘텐츠로 한국어 실력을 향상시키세요
          </p>
        </div>

        <PlaceholderCard 
          title="멤버십 영상실 준비 중입니다..."
          description="고품질 영상 콘텐츠와 체계적인 학습 자료를 준비하고 있습니다. 곧 만나볼 수 있어요!"
        />
      </div>
    </div>
  );
};

export default MembershipPage;