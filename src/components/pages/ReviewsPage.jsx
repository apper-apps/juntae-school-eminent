import PlaceholderCard from "@/components/molecules/PlaceholderCard";

const ReviewsPage = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
            리뷰 · 후기
          </h1>
          <p className="text-slate-400 text-lg">
            준태스쿨과 함께한 학습자들의 생생한 후기
          </p>
        </div>

        <PlaceholderCard 
          title="리뷰 · 후기 준비 중입니다..."
          description="학습자들의 소중한 후기와 성공 스토리를 수집하고 있습니다. 곧 공유해드릴게요!"
        />
      </div>
    </div>
  );
};

export default ReviewsPage;