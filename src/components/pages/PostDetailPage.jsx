import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { postService } from '@/services/postService';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import PostForm from '@/components/organisms/PostForm';

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      setLoading(true);
      setError(null);
      const postData = postService.getById(id);
      
      if (!postData) {
        setError('포스트를 찾을 수 없습니다.');
        return;
      }
      
      setPost(postData);
    } catch (err) {
      setError(err.message || '포스트를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const canEdit = () => {
    if (!user || !post) return false;
    return user.is_admin || user.id === post.author_id;
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = async () => {
    if (!window.confirm('정말로 이 포스트를 삭제하시겠습니까?')) {
      return;
    }

    try {
      postService.delete(post.Id);
      navigate('/money-insight');
    } catch (err) {
      toast.error(err.message || '삭제 중 오류가 발생했습니다.');
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      const updatedPost = postService.update(post.Id, formData);
      setPost(updatedPost);
      setIsEditing(false);
    } catch (err) {
      throw err;
    }
  };

  const handleFormCancel = () => {
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    return dateString; // Already in yyyy-mm-dd format
  };

  const handleBackClick = () => {
    navigate('/money-insight');
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!post) return <Error message="포스트를 찾을 수 없습니다." />;

  if (isEditing) {
    return (
      <div className="min-h-screen bg-slate-950">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-900 border border-slate-700 rounded-xl">
              <PostForm
                post={post}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            onClick={handleBackClick}
            className="flex items-center gap-2"
          >
            <ApperIcon name="ArrowLeft" size={16} />
            목록으로
          </Button>
          
          {canEdit() && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleEdit}
                className="flex items-center gap-2"
              >
                <ApperIcon name="Edit" size={16} />
                수정
              </Button>
              <Button
                variant="outline"
                onClick={handleDelete}
                className="text-red-400 hover:text-red-300 hover:border-red-500/50 flex items-center gap-2"
              >
                <ApperIcon name="Trash2" size={16} />
                삭제
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        <article className="max-w-4xl mx-auto">
          {/* Hero Image */}
          {post.thumbnail_url && (
            <div className="aspect-video w-full mb-8 rounded-xl overflow-hidden bg-slate-800">
              <img
                src={post.thumbnail_url}
                alt={post.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=450&fit=crop';
                }}
              />
            </div>
          )}

          {/* Title and Meta */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-4 text-slate-400">
              <div className="flex items-center gap-2">
                <ApperIcon name="User" size={16} />
                <span>{post.author_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <ApperIcon name="Calendar" size={16} />
                <span>{formatDate(post.created_at)}</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div 
            className="prose prose-invert prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content_richtext }}
            style={{
              '--tw-prose-body': '#e2e8f0',
              '--tw-prose-headings': '#f8fafc',
              '--tw-prose-links': '#60a5fa',
              '--tw-prose-bold': '#f8fafc',
              '--tw-prose-bullets': '#94a3b8',
              '--tw-prose-quotes': '#cbd5e1',
              '--tw-prose-code': '#f8fafc',
              '--tw-prose-pre-code': '#e2e8f0',
              '--tw-prose-pre-bg': '#1e293b',
              '--tw-prose-th-borders': '#475569',
              '--tw-prose-td-borders': '#334155'
            }}
          />
        </article>
      </div>
    </div>
  );
};

export default PostDetailPage;