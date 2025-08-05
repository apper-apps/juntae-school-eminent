import React from 'react';
import LectureCard from '@/components/molecules/LectureCard';

const LectureList = ({ lectures, onEdit, onDelete, canEdit = false }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {lectures.map((lecture) => (
        <LectureCard
          key={lecture.Id}
          lecture={lecture}
          onEdit={canEdit ? () => onEdit(lecture) : null}
          onDelete={canEdit ? () => onDelete(lecture.Id) : null}
        />
      ))}
    </div>
  );
};

export default LectureList;