import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { postService } from '@/services/postService';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import PostCard from '@/components/molecules/PostCard';
import PostForm from '@/components/organisms/PostForm';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';

const MoneyInsightPage = () => {
  const { user, openAuthModal } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = postService.getAll();
      setPosts(data);
    } catch (err) {
      setError(err.message || '포스트를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = () => {
    if (!user) {
      openAuthModal();
      return;
    }
    setShowCreateForm(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      const newPost = postService.create(formData);
      setPosts(prev => [newPost, ...prev]);
      setShowCreateForm(false);
    } catch (err) {
      throw err;
    }
  };

  const handleFormCancel = () => {
    setShowCreateForm(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredPosts = posts.filter(post => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.author_name.toLowerCase().includes(query) ||
      post.content_richtext.toLowerCase().includes(query)
    );
  });

  if (showCreateForm) {
    return (
      <div className="min-h-screen bg-slate-950">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-900 border border-slate-700 rounded-xl">
              <PostForm
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
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
            머니 인사이트
          </h1>
          <p className="text-slate-400 text-lg mb-8">
            한국어와 함께 배우는 실용적인 경제 지식
          </p>
          
          {/* Search and Create */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between max-w-2xl mx-auto">
            <div className="relative flex-1 w-full">
              <ApperIcon 
                name="Search" 
                size={16} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" 
              />
              <Input
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="포스트 검색..."
                className="pl-10"
              />
            </div>
            
            <Button
              onClick={handleCreatePost}
              className="whitespace-nowrap"
            >
              <ApperIcon name="PenTool" size={16} className="mr-2" />
              글쓰기✍️
            </Button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <Loading />
        ) : error ? (
          <Error message={error} />
        ) : filteredPosts.length === 0 ? (
          <Empty message={searchQuery ? "검색 결과가 없습니다." : "아직 작성된 포스트가 없습니다."} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {filteredPosts.map((post) => (
              <PostCard key={post.Id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MoneyInsightPage;