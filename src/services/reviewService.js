import { toast } from 'react-toastify';

class ReviewService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'review';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "text" } },
          { field: { Name: "author_id" } },
          { field: { Name: "author_name" } },
          { field: { Name: "created_at" } },
          { field: { Name: "likes" } }
        ],
        orderBy: [
          {
            fieldName: "created_at",
            sorttype: "DESC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching reviews:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error(error.message);
        toast.error('리뷰를 불러오는 중 오류가 발생했습니다.');
      }
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "text" } },
          { field: { Name: "author_id" } },
          { field: { Name: "author_name" } },
          { field: { Name: "created_at" } },
          { field: { Name: "likes" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching review with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async create(reviewData) {
    try {
      // Only include Updateable fields based on schema
      const params = {
        records: [{
          Name: reviewData.text?.substring(0, 50) || '리뷰', // Use text excerpt as Name
          text: reviewData.text,
          author_id: reviewData.author_id,
          author_name: reviewData.author_name,
          created_at: new Date().toISOString(),
          likes: reviewData.likes || ""
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create reviews ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          toast.success('리뷰가 성공적으로 등록되었습니다.');
          return successfulRecords[0].data;
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating review:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error(error.message);
        toast.error('리뷰 등록 중 오류가 발생했습니다.');
      }
    }
    return null;
  }

  async update(id, updateData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: updateData.text?.substring(0, 50) || updateData.Name,
          ...(updateData.text && { text: updateData.text }),
          ...(updateData.author_id && { author_id: updateData.author_id }),
          ...(updateData.author_name && { author_name: updateData.author_name }),
          ...(updateData.likes !== undefined && { likes: updateData.likes })
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update reviews ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          toast.success('리뷰가 성공적으로 수정되었습니다.');
          return successfulUpdates[0].data;
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating review:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error(error.message);
        toast.error('리뷰 수정 중 오류가 발생했습니다.');
      }
    }
    return null;
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete reviews ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulDeletions.length > 0) {
          toast.success('리뷰가 성공적으로 삭제되었습니다.');
          return true;
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting review:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error(error.message);
        toast.error('리뷰 삭제 중 오류가 발생했습니다.');
      }
    }
    return false;
  }

  async toggleLike(id, userId) {
    try {
      // Get current review data
      const review = await this.getById(id);
      if (!review) {
        toast.error('리뷰를 찾을 수 없습니다.');
        return null;
      }

      // Parse current likes (MultiPicklist stored as comma-separated string)
      const currentLikes = review.likes ? review.likes.split(',').filter(like => like.trim()) : [];
      let newLikes;

      if (currentLikes.includes(userId)) {
        // Remove like
        newLikes = currentLikes.filter(like => like !== userId);
        toast.success('좋아요를 취소했습니다.');
      } else {
        // Add like
        newLikes = [...currentLikes, userId];
        toast.success('좋아요를 표시했습니다.');
      }

      // Update with new likes
      const updatedReview = await this.update(id, {
        likes: newLikes.join(',')
      });

      return updatedReview;
    } catch (error) {
      console.error('Toggle like error:', error);
      toast.error('좋아요 처리 중 오류가 발생했습니다.');
      return null;
    }
  }

  hasUserLiked(review, userId) {
    if (!review?.likes || !userId) return false;
    const likes = review.likes.split(',').filter(like => like.trim());
    return likes.includes(userId);
  }

  canUserDelete(review, userId) {
    if (!review || !userId) return false;
    return review.author_id === userId;
  }
}

export const reviewService = new ReviewService();

export default reviewService;