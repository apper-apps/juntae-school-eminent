import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';

const PostCard = ({ post }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/money-insight/${post.Id}`);
  };

  const formatDate = (dateString) => {
    return dateString; // Already in yyyy-mm-dd format
  };

  const getImageUrl = (url) => {
    return url || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=225&fit=crop';
  };

  return (
    <Card 
      className="overflow-hidden hover:border-slate-600 transition-all duration-200 cursor-pointer group"
      onClick={handleCardClick}
    >
      {/* Thumbnail - 16:9 aspect ratio */}
      <div className="aspect-video w-full overflow-hidden bg-slate-800">
        <img
          src={getImageUrl(post.thumbnail_url)}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=225&fit=crop';
          }}
        />
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="text-base font-semibold text-slate-100 mb-2 line-clamp-2 leading-tight">
          {post.title}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>{post.author_name}</span>
          <div className="flex items-center gap-1">
            <ApperIcon name="Calendar" size={14} />
            <span>{formatDate(post.created_at)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PostCard;