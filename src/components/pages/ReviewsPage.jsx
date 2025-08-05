import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { reviewService } from '@/services/reviewService';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';

const ReviewsPage = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    text: '',
    author_name: ''
  });

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = reviewService.getAll();
      setReviews(data);
    } catch (err) {
      setError('리뷰를 불러오는 중 오류가 발생했습니다.');
      console.error('Load reviews error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.text.trim()) {
      return;
    }

    if (formData.text.length > 500) {
      return;
    }

    try {
      setSubmitting(true);
      const newReview = reviewService.create(formData, user);
      setReviews(prev => [newReview, ...prev]);
      setFormData({ text: '', author_name: '' });
    } catch (err) {
      console.error('Submit review error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (reviewId) => {
    try {
      const updatedReview = reviewService.toggleLike(reviewId, user?.id);
      setReviews(prev => prev.map(r => 
        r.Id === reviewId ? updatedReview : r
      ));
    } catch (err) {
      console.error('Toggle like error:', err);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
      return;
    }

    try {
      reviewService.delete(reviewId, user?.id);
      setReviews(prev => prev.filter(r => r.Id !== reviewId));
    } catch (err) {
      console.error('Delete review error:', err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return '방금 전';
    } else if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    } else if (diffInHours < 168) {
      const days = Math.floor(diffInHours / 24);
      return `${days}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  const getAvatarLetter = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <div className="container mx-auto px-4 py-16">
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950">
        <div className="container mx-auto px-4 py-16">
          <Error message={error} onRetry={loadReviews} />
        </div>
      </div>
    );
  }

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

        {/* Review Form */}
        <Card className="mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!user && (
              <div>
                <Input
                  type="text"
                  name="author_name"
                  placeholder="닉네임(선택)"
                  value={formData.author_name}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
            )}
            
            <div className="relative">
              <textarea
                name="text"
                placeholder="리뷰나 후기를 남겨주세요..."
                value={formData.text}
                onChange={handleInputChange}
                maxLength={500}
                className="w-full h-32 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                required
              />
              <div className="absolute bottom-3 right-3 text-sm text-slate-400">
                {formData.text.length}/500
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={submitting || !formData.text.trim() || formData.text.length > 500}
                className="px-6"
              >
                {submitting ? '등록 중...' : '등록'}
              </Button>
            </div>
          </form>
        </Card>

        {/* Reviews Timeline */}
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <Empty
              title="아직 리뷰가 없습니다"
              description="첫 번째 리뷰를 남겨보세요!"
              icon="MessageSquare"
            />
          ) : (
            reviews.map(review => {
              const hasLiked = reviewService.hasUserLiked(review.Id, user?.id);
              const canDelete = reviewService.canUserDelete(review.Id, user?.id);
              
              return (
                <Card key={review.Id} className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {getAvatarLetter(review.author_name)}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-slate-100">
                            {review.author_name}
                          </h3>
                          <span className="text-slate-400 text-sm">
                            {formatDate(review.created_at)}
                          </span>
                        </div>
                        
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(review.Id)}
                            className="text-slate-400 hover:text-red-400 transition-colors p-1"
                            title="삭제"
                          >
                            <ApperIcon name="Trash2" size={16} />
                          </button>
                        )}
                      </div>
                      
                      <p className="text-slate-200 mb-4 leading-relaxed">
                        {review.text}
                      </p>
                      
                      {/* Like Button */}
                      <button
                        onClick={() => handleLike(review.Id)}
                        className={`flex items-center space-x-2 transition-colors ${
                          hasLiked
                            ? 'text-red-500 hover:text-red-600'
                            : 'text-slate-400 hover:text-red-500'
                        }`}
                      >
                        <ApperIcon 
                          name="Heart" 
                          size={18} 
                          className={hasLiked ? 'fill-current' : ''}
                        />
                        <span className="text-sm font-medium">
                          {review.likes.length}
                        </span>
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;