import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const Error = ({ error = "오류가 발생했습니다.", onRetry }) => {
  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-md mx-auto p-8 text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name="AlertCircle" size={24} className="text-red-400" />
        </div>
        
        <h3 className="text-lg font-semibold text-slate-100 mb-3">
          문제가 발생했습니다
        </h3>
        
        <p className="text-slate-400 mb-6">
          {error}
        </p>
        
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            다시 시도
          </Button>
        )}
      </Card>
    </div>
  );
};

export default Error;