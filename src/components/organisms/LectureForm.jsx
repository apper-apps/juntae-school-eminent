import React, { useState, useEffect } from 'react';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import ApperIcon from '@/components/ApperIcon';

const LectureForm = ({ lecture, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    cohort_number: 0,
    category: '',
    embed_link: '',
    sort_order: 0,
    type: 'membership'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (lecture) {
      setFormData({
        title: lecture.title || '',
        cohort_number: lecture.cohort_number || 0,
        category: lecture.category || '',
        embed_link: lecture.embed_link || '',
        sort_order: lecture.sort_order || 0,
        type: lecture.type || 'membership'
      });
    }
  }, [lecture]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = '강의 제목을 입력해주세요.';
    }

    if (!formData.category.trim()) {
      newErrors.category = '카테고리를 입력해주세요.';
    }

    if (!formData.embed_link.trim()) {
      newErrors.embed_link = '임베드 링크를 입력해주세요.';
    } else if (!isValidUrl(formData.embed_link)) {
      newErrors.embed_link = '유효한 URL을 입력해주세요.';
    }

    if (formData.cohort_number < 0) {
      newErrors.cohort_number = '코호트 번호는 0 이상이어야 합니다.';
    }

    if (formData.sort_order < 0) {
      newErrors.sort_order = '정렬 순서는 0 이상이어야 합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cohort_number' || name === 'sort_order' ? parseInt(value) || 0 : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-100">
          {lecture ? '강의 수정' : '새 강의 추가'}
        </h2>
        <button
          onClick={onCancel}
          className="text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ApperIcon name="X" size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">강의 제목 *</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="강의 제목을 입력하세요"
            className={`mt-1 ${errors.title ? 'border-red-500' : ''}`}
          />
          {errors.title && (
            <p className="text-red-400 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        <div>
          <Label htmlFor="category">카테고리 *</Label>
          <Input
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            placeholder="카테고리를 입력하세요"
            className={`mt-1 ${errors.category ? 'border-red-500' : ''}`}
          />
          {errors.category && (
            <p className="text-red-400 text-sm mt-1">{errors.category}</p>
          )}
        </div>

        <div>
          <Label htmlFor="embed_link">임베드 링크 *</Label>
          <Input
            id="embed_link"
            name="embed_link"
            type="url"
            value={formData.embed_link}
            onChange={handleInputChange}
            placeholder="https://example.com/embed/video"
            className={`mt-1 ${errors.embed_link ? 'border-red-500' : ''}`}
          />
          {errors.embed_link && (
            <p className="text-red-400 text-sm mt-1">{errors.embed_link}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cohort_number">코호트 번호</Label>
            <Input
              id="cohort_number"
              name="cohort_number"
              type="number"
              min="0"
              value={formData.cohort_number}
              onChange={handleInputChange}
              className={`mt-1 ${errors.cohort_number ? 'border-red-500' : ''}`}
            />
            {errors.cohort_number && (
              <p className="text-red-400 text-sm mt-1">{errors.cohort_number}</p>
            )}
          </div>

          <div>
            <Label htmlFor="sort_order">정렬 순서</Label>
            <Input
              id="sort_order"
              name="sort_order"
              type="number"
              min="0"
              value={formData.sort_order}
              onChange={handleInputChange}
              className={`mt-1 ${errors.sort_order ? 'border-red-500' : ''}`}
            />
            {errors.sort_order && (
              <p className="text-red-400 text-sm mt-1">{errors.sort_order}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="type">유형 *</Label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="mt-1 w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="membership">멤버십</option>
            <option value="master">마스터</option>
            <option value="master_common">마스터 공통</option>
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? (
              <>
                <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                저장 중...
              </>
            ) : (
              <>
                <ApperIcon name="Save" size={16} className="mr-2" />
                {lecture ? '수정' : '생성'}
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1"
          >
            취소
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LectureForm;