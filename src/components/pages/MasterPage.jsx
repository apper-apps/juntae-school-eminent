import PlaceholderCard from "@/components/molecules/PlaceholderCard";

const MasterPage = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
            마스터 과정
          </h1>
          <p className="text-slate-400 text-lg">
            전문가 수준의 한국어 실력을 완성하는 심화 과정
          </p>
        </div>

        <PlaceholderCard 
          title="마스터 과정 준비 중입니다..."
          description="한국어 마스터가 되기 위한 전문적인 커리큘럼을 설계하고 있습니다. 기대해 주세요!"
        />
      </div>
    </div>
  );
};

export default MasterPage;