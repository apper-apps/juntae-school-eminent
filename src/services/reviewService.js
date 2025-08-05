import { toast } from 'react-toastify';

const mockReviews = [
  {
    Id: 1,
    text: "준태스쿨 덕분에 투자에 대한 기초를 탄탄히 다질 수 있었어요. 복잡했던 개념들을 쉽게 설명해주셔서 정말 도움이 많이 되었습니다!",
    author_id: "user_1",
    author_name: "준태",
    created_at: "2024-01-20T10:30:00.000Z",
    likes: ["user_2", "temp_123"]
  },
  {
    Id: 2,
    text: "예산 관리 강의가 정말 실용적이었어요. 이제 가계부를 체계적으로 관리할 수 있게 되었습니다. 감사합니다!",
    author_id: "temp_456",
    author_name: "경제초보",
    created_at: "2024-01-19T15:45:00.000Z",
    likes: ["user_1"]
  },
  {
    Id: 3,
    text: "부동산 투자에 대해 막연한 두려움이 있었는데, 체계적인 분석 방법을 배워서 자신감이 생겼어요. 추천합니다!",
    author_id: "user_2",
    author_name: "김투자",
    created_at: "2024-01-18T09:15:00.000Z",
    likes: ["user_1", "temp_456", "temp_789"]
  }
];

let reviewData = [...mockReviews];
let nextId = Math.max(...reviewData.map(r => r.Id)) + 1;

// Generate or retrieve temporary user ID for anonymous users
const getTempUserId = () => {
  let tempId = localStorage.getItem('temp_user_id');
  if (!tempId) {
    tempId = 'temp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('temp_user_id', tempId);
  }
  return tempId;
};

export const reviewService = {
  getAll: () => {
    return [...reviewData].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  getById: (id) => {
    const numId = parseInt(id);
    if (isNaN(numId)) {
      throw new Error('유효하지 않은 ID입니다.');
    }
    return reviewData.find(review => review.Id === numId) || null;
  },

  create: (reviewData, currentUser = null) => {
    // Validate text length
    if (!reviewData.text || reviewData.text.trim().length === 0) {
      throw new Error('리뷰 내용을 입력해주세요.');
    }
    if (reviewData.text.length > 500) {
      throw new Error('리뷰는 500자를 초과할 수 없습니다.');
    }

    let author_id, author_name;
    
    if (currentUser) {
      // Logged in user
      author_id = currentUser.id;
      author_name = currentUser.name || currentUser.email.split('@')[0];
    } else {
      // Anonymous user
      author_id = getTempUserId();
      author_name = reviewData.author_name?.trim() || '익명';
    }

    const newReview = {
      Id: nextId++,
      text: reviewData.text.trim(),
      author_id,
      author_name,
      created_at: new Date().toISOString(),
      likes: []
    };
    
    reviewData.push(newReview);
    toast.success('리뷰가 성공적으로 등록되었습니다.');
    return { ...newReview };
  },

  update: (id, updateData) => {
    const numId = parseInt(id);
    if (isNaN(numId)) {
      throw new Error('유효하지 않은 ID입니다.');
    }

    const index = reviewData.findIndex(review => review.Id === numId);
    if (index === -1) {
      throw new Error('리뷰를 찾을 수 없습니다.');
    }

    // Validate text length if being updated
    if (updateData.text && updateData.text.length > 500) {
      throw new Error('리뷰는 500자를 초과할 수 없습니다.');
    }

    reviewData[index] = {
      ...reviewData[index],
      ...updateData,
      Id: numId // Preserve original ID
    };

    toast.success('리뷰가 성공적으로 수정되었습니다.');
    return { ...reviewData[index] };
  },

  delete: (id, currentUserId = null) => {
    const numId = parseInt(id);
    if (isNaN(numId)) {
      throw new Error('유효하지 않은 ID입니다.');
    }

    const index = reviewData.findIndex(review => review.Id === numId);
    if (index === -1) {
      throw new Error('리뷰를 찾을 수 없습니다.');
    }

    const review = reviewData[index];
    
    // Check if user has permission to delete
    const userIdToCheck = currentUserId || getTempUserId();
    if (review.author_id !== userIdToCheck) {
      throw new Error('본인이 작성한 리뷰만 삭제할 수 있습니다.');
    }

    const deletedReview = reviewData[index];
    reviewData.splice(index, 1);
    toast.success('리뷰가 성공적으로 삭제되었습니다.');
    return deletedReview;
  },

  toggleLike: (id, currentUserId = null) => {
    const numId = parseInt(id);
    if (isNaN(numId)) {
      throw new Error('유효하지 않은 ID입니다.');
    }

    const review = reviewData.find(review => review.Id === numId);
    if (!review) {
      throw new Error('리뷰를 찾을 수 없습니다.');
    }

    const userIdToUse = currentUserId || getTempUserId();
    const likeIndex = review.likes.indexOf(userIdToUse);
    
    if (likeIndex === -1) {
      // Add like
      review.likes.push(userIdToUse);
      toast.success('좋아요를 표시했습니다.');
    } else {
      // Remove like
      review.likes.splice(likeIndex, 1);
      toast.success('좋아요를 취소했습니다.');
    }

    return { ...review };
  },

  hasUserLiked: (reviewId, currentUserId = null) => {
    const review = reviewData.find(r => r.Id === reviewId);
    if (!review) return false;
    
    const userIdToCheck = currentUserId || getTempUserId();
    return review.likes.includes(userIdToCheck);
  },

  canUserDelete: (reviewId, currentUserId = null) => {
    const review = reviewData.find(r => r.Id === reviewId);
    if (!review) return false;
    
    const userIdToCheck = currentUserId || getTempUserId();
    return review.author_id === userIdToCheck;
  }
};

export default reviewService;