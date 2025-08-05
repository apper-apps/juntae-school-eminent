import { toast } from 'react-toastify';

class PostService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'post';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "content_richtext" } },
          { field: { Name: "thumbnail_url" } },
          { field: { Name: "author_id" } },
          { field: { Name: "author_name" } },
          { field: { Name: "created_at" } }
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
        console.error("Error fetching posts:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error(error.message);
        toast.error('포스트를 불러오는 중 오류가 발생했습니다.');
      }
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "content_richtext" } },
          { field: { Name: "thumbnail_url" } },
          { field: { Name: "author_id" } },
          { field: { Name: "author_name" } },
          { field: { Name: "created_at" } }
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
        console.error(`Error fetching post with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async create(postData) {
    try {
      // Only include Updateable fields based on schema
      const params = {
        records: [{
          Name: postData.title || '제목 없음',
          title: postData.title,
          content_richtext: postData.content_richtext,
          thumbnail_url: postData.thumbnail_url,
          author_id: parseInt(postData.author_id), // Lookup field as integer
          author_name: postData.author_name,
          created_at: new Date().toISOString().split('T')[0] // Date format YYYY-MM-DD
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
          console.error(`Failed to create posts ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          toast.success('포스트가 성공적으로 생성되었습니다.');
          return successfulRecords[0].data;
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating post:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error(error.message);
        toast.error('포스트 생성 중 오류가 발생했습니다.');
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
          ...(updateData.title && { Name: updateData.title, title: updateData.title }),
          ...(updateData.content_richtext && { content_richtext: updateData.content_richtext }),
          ...(updateData.thumbnail_url && { thumbnail_url: updateData.thumbnail_url }),
          ...(updateData.author_id && { author_id: parseInt(updateData.author_id) }),
          ...(updateData.author_name && { author_name: updateData.author_name }),
          ...(updateData.created_at && { created_at: updateData.created_at })
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
          console.error(`Failed to update posts ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          toast.success('포스트가 성공적으로 수정되었습니다.');
          return successfulUpdates[0].data;
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating post:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error(error.message);
        toast.error('포스트 수정 중 오류가 발생했습니다.');
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
          console.error(`Failed to delete posts ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulDeletions.length > 0) {
          toast.success('포스트가 성공적으로 삭제되었습니다.');
          return true;
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting post:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error(error.message);
        toast.error('포스트 삭제 중 오류가 발생했습니다.');
      }
    }
    return false;
  }

  async getByAuthor(authorId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "content_richtext" } },
          { field: { Name: "thumbnail_url" } },
          { field: { Name: "author_id" } },
          { field: { Name: "author_name" } },
          { field: { Name: "created_at" } }
        ],
        where: [
          {
            FieldName: "author_id",
            Operator: "EqualTo",
            Values: [parseInt(authorId)]
          }
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
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching posts by author:', error);
      return [];
    }
  }

  async search(query) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "content_richtext" } },
          { field: { Name: "thumbnail_url" } },
          { field: { Name: "author_id" } },
          { field: { Name: "author_name" } },
          { field: { Name: "created_at" } }
        ],
        whereGroups: [
          {
            operator: "OR",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "title",
                    operator: "Contains",
                    values: [query]
                  }
                ],
                operator: "OR"
              },
              {
                conditions: [
                  {
                    fieldName: "content_richtext",
                    operator: "Contains",
                    values: [query]
                  }
                ],
                operator: "OR"
              },
              {
                conditions: [
                  {
                    fieldName: "author_name",
                    operator: "Contains",
                    values: [query]
                  }
                ],
                operator: "OR"
              }
            ]
          }
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
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error searching posts:', error);
      return [];
    }
  }
}

export const postService = new PostService();
export default postService;