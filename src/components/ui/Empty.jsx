import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const Empty = ({ 
  title = "콘텐츠가 없습니다", 
  description = "아직 표시할 콘텐츠가 없습니다.",
  actionText,
  onAction 
}) => {
  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-md mx-auto p-8 text-center">
        <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name="Package" size={24} className="text-slate-400" />
        </div>
        
        <h3 className="text-lg font-semibold text-slate-100 mb-3">
          {title}
        </h3>
        
        <p className="text-slate-400 mb-6">
          {description}
        </p>
        
        {actionText && onAction && (
          <Button onClick={onAction}>
            {actionText}
          </Button>
        )}
      </Card>
    </div>
  );
};

export default Empty;