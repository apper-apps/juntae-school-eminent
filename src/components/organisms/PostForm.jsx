import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import ApperIcon from '@/components/ApperIcon';

const PostForm = ({ post, onSubmit, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content_richtext: '',
    thumbnail_url: '',
    author_id: user?.id || '',
    author_name: user?.name || ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showImageUrlInput, setShowImageUrlInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        content_richtext: post.content_richtext || '',
        thumbnail_url: post.thumbnail_url || '',
        author_id: post.author_id || user?.id || '',
        author_name: post.author_name || user?.name || ''
      });
    } else if (user) {
      setFormData(prev => ({
        ...prev,
        author_id: user.id,
        author_name: user.name
      }));
    }
  }, [post, user]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요.';
    }

    if (!formData.content_richtext.trim()) {
      newErrors.content_richtext = '내용을 입력해주세요.';
    }

    if (formData.thumbnail_url && !isValidUrl(formData.thumbnail_url)) {
      newErrors.thumbnail_url = '유효한 이미지 URL을 입력해주세요.';
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
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleContentChange = (e) => {
    setFormData(prev => ({
      ...prev,
      content_richtext: e.target.value
    }));

    if (errors.content_richtext) {
      setErrors(prev => ({
        ...prev,
        content_richtext: ''
      }));
    }
  };

  const insertImageToContent = () => {
    if (!imageUrl || !isValidUrl(imageUrl)) {
      alert('유효한 이미지 URL을 입력해주세요.');
      return;
    }

    const imageHtml = `<img src="${imageUrl}" alt="삽입된 이미지" style="max-width: 100%; height: auto; margin: 1rem 0;" />`;
    const textarea = document.querySelector('[name="content_richtext"]');
    const cursorPosition = textarea.selectionStart;
    const textBefore = formData.content_richtext.substring(0, cursorPosition);
    const textAfter = formData.content_richtext.substring(cursorPosition);
    
    setFormData(prev => ({
      ...prev,
      content_richtext: textBefore + imageHtml + textAfter
    }));
    
    setImageUrl('');
    setShowImageUrlInput(false);
  };

  const insertFormatting = (tag) => {
    const textarea = document.querySelector('[name="content_richtext"]');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content_richtext.substring(start, end);
    
    let replacement = '';
    switch (tag) {
      case 'h2':
        replacement = `<h2>${selectedText || '제목을 입력하세요'}</h2>`;
        break;
      case 'h3':
        replacement = `<h3>${selectedText || '소제목을 입력하세요'}</h3>`;
        break;
      case 'p':
        replacement = `<p>${selectedText || '문단을 입력하세요'}</p>`;
        break;
      case 'strong':
        replacement = `<strong>${selectedText || '굵은 텍스트'}</strong>`;
        break;
      case 'ul':
        replacement = `<ul><li>${selectedText || '목록 항목'}</li></ul>`;
        break;
      case 'ol':
        replacement = `<ol><li>${selectedText || '번호 목록 항목'}</li></ol>`;
        break;
      default:
        return;
    }
    
    const textBefore = formData.content_richtext.substring(0, start);
    const textAfter = formData.content_richtext.substring(end);
    
    setFormData(prev => ({
      ...prev,
      content_richtext: textBefore + replacement + textAfter
    }));
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
          {post ? '포스트 수정' : '새 포스트 작성'}
        </h2>
        <button
          onClick={onCancel}
          className="text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ApperIcon name="X" size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="title">제목 *</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="포스트 제목을 입력하세요"
            className={`mt-1 ${errors.title ? 'border-red-500' : ''}`}
          />
          {errors.title && (
            <p className="text-red-400 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        <div>
          <Label htmlFor="thumbnail_url">썸네일 이미지 URL</Label>
          <Input
            id="thumbnail_url"
            name="thumbnail_url"
            type="url"
            value={formData.thumbnail_url}
            onChange={handleInputChange}
            placeholder="https://example.com/image.jpg"
            className={`mt-1 ${errors.thumbnail_url ? 'border-red-500' : ''}`}
          />
          {errors.thumbnail_url && (
            <p className="text-red-400 text-sm mt-1">{errors.thumbnail_url}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="content_richtext">내용 *</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setShowImageUrlInput(!showImageUrlInput)}
                className="text-xs"
              >
                <ApperIcon name="Image" size={14} className="mr-1" />
                이미지
              </Button>
            </div>
          </div>

          {/* Formatting toolbar */}
          <div className="flex flex-wrap gap-2 mb-2 p-2 bg-slate-800 rounded-lg border border-slate-600">
            <button
              type="button"
              onClick={() => insertFormatting('h2')}
              className="px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 rounded text-slate-200"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('h3')}
              className="px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 rounded text-slate-200"
            >
              H3
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('p')}
              className="px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 rounded text-slate-200"
            >
              문단
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('strong')}
              className="px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 rounded text-slate-200"
            >
              <strong>굵게</strong>
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('ul')}
              className="px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 rounded text-slate-200"
            >
              • 목록
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('ol')}
              className="px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 rounded text-slate-200"
            >
              1. 번호
            </button>
          </div>

          {/* Image URL input */}
          {showImageUrlInput && (
            <div className="mb-2 p-3 bg-slate-800 rounded-lg border border-slate-600">
              <div className="flex gap-2">
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="이미지 URL을 입력하세요"
                  className="flex-1"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={insertImageToContent}
                >
                  삽입
                </Button>
              </div>
            </div>
          )}

          <textarea
            id="content_richtext"
            name="content_richtext"
            value={formData.content_richtext}
            onChange={handleContentChange}
            placeholder="HTML 태그를 사용하여 내용을 작성하세요..."
            rows={15}
            className={`w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm ${errors.content_richtext ? 'border-red-500' : ''}`}
          />
          {errors.content_richtext && (
            <p className="text-red-400 text-sm mt-1">{errors.content_richtext}</p>
          )}
          <p className="text-slate-500 text-xs mt-1">
            HTML 태그를 사용할 수 있습니다. 이미지는 외부 URL로만 삽입 가능합니다.
          </p>
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
                {post ? '수정' : '발행'}
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

export default PostForm;