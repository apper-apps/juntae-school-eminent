import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const PlaceholderCard = ({ title, description }) => {
  return (
    <Card className="p-8 text-center">
      <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
        <ApperIcon name="Construction" size={24} className="text-slate-400" />
      </div>
      
      <h3 className="text-lg font-semibold text-slate-100 mb-3">
        {title || "준비 중입니다..."}
      </h3>
      
      <p className="text-slate-400 leading-relaxed">
        {description || "곧 멋진 콘텐츠로 찾아뵙겠습니다. 조금만 기다려 주세요!"}
      </p>
    </Card>
  );
};

export default PlaceholderCard;