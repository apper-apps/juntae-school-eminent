import PlaceholderCard from "@/components/molecules/PlaceholderCard";

const MoneyInsightPage = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
            머니 인사이트
          </h1>
          <p className="text-slate-400 text-lg">
            한국어와 함께 배우는 실용적인 경제 지식
          </p>
        </div>

        <PlaceholderCard 
          title="머니 인사이트 준비 중입니다..."
          description="한국어 학습과 경제 교육을 결합한 특별한 콘텐츠를 준비하고 있습니다. 곧 공개됩니다!"
        />
      </div>
    </div>
  );
};

export default MoneyInsightPage;