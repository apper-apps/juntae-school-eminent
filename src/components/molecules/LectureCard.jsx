import React from 'react';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const LectureCard = ({ lecture, onEdit, onDelete }) => {
  const getTypeLabel = (type) => {
    switch (type) {
      case 'membership':
        return '멤버십';
      case 'master':
        return '마스터';
      case 'master_common':
        return '마스터 공통';
      default:
        return type;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'membership':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'master':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'master_common':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const handleWatchLecture = () => {
    if (lecture.embed_link) {
      window.open(lecture.embed_link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card className="p-6 hover:border-slate-600 transition-colors duration-200">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-100 mb-2 line-clamp-2">
              {lecture.title}
            </h3>
            <p className="text-slate-400 text-sm mb-2">
              {lecture.category}
            </p>
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(lecture.type)}`}>
                {getTypeLabel(lecture.type)}
              </span>
              {lecture.cohort_number > 0 && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-300">
                  코호트 {lecture.cohort_number}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 mb-4">
          <div className="text-sm text-slate-500 space-y-1">
            <div className="flex items-center gap-2">
              <ApperIcon name="Hash" size={14} />
              <span>정렬 순서: {lecture.sort_order}</span>
            </div>
            {lecture.embed_link && (
              <div className="flex items-center gap-2">
                <ApperIcon name="ExternalLink" size={14} />
                <span className="truncate">강의 링크 있음</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-slate-700">
          {lecture.embed_link && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleWatchLecture}
              className="flex-1"
            >
              <ApperIcon name="Play" size={14} className="mr-1" />
              시청하기
            </Button>
          )}
          
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="flex-1"
            >
              <ApperIcon name="Edit" size={14} className="mr-1" />
              수정
            </Button>
          )}
          
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="text-red-400 hover:text-red-300 hover:border-red-500/50"
            >
              <ApperIcon name="Trash2" size={14} />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default LectureCard;