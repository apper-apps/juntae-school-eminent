import { toast } from 'react-toastify';

class LectureService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'lecture';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "cohort_number" } },
          { field: { Name: "category" } },
          { field: { Name: "embed_link" } },
          { field: { Name: "sort_order" } },
          { field: { Name: "type" } }
        ],
        orderBy: [
          {
            fieldName: "sort_order",
            sorttype: "ASC"
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
        console.error("Error fetching lectures:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error(error.message);
        toast.error('강의를 불러오는 중 오류가 발생했습니다.');
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
          { field: { Name: "cohort_number" } },
          { field: { Name: "category" } },
          { field: { Name: "embed_link" } },
          { field: { Name: "sort_order" } },
          { field: { Name: "type" } }
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
        console.error(`Error fetching lecture with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async create(lectureData) {
    try {
      // Only include Updateable fields based on schema
      const params = {
        records: [{
          Name: lectureData.title || '강의 제목',
          title: lectureData.title,
          cohort_number: parseInt(lectureData.cohort_number) || 0,
          category: lectureData.category,
          embed_link: lectureData.embed_link,
          sort_order: parseInt(lectureData.sort_order) || 0,
          type: lectureData.type
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
          console.error(`Failed to create lectures ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          toast.success('강의가 성공적으로 생성되었습니다.');
          return successfulRecords[0].data;
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating lecture:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error(error.message);
        toast.error('강의 생성 중 오류가 발생했습니다.');
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
          ...(updateData.cohort_number !== undefined && { cohort_number: parseInt(updateData.cohort_number) }),
          ...(updateData.category && { category: updateData.category }),
          ...(updateData.embed_link && { embed_link: updateData.embed_link }),
          ...(updateData.sort_order !== undefined && { sort_order: parseInt(updateData.sort_order) }),
          ...(updateData.type && { type: updateData.type })
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
          console.error(`Failed to update lectures ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          toast.success('강의가 성공적으로 수정되었습니다.');
          return successfulUpdates[0].data;
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating lecture:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error(error.message);
        toast.error('강의 수정 중 오류가 발생했습니다.');
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
          console.error(`Failed to delete lectures ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulDeletions.length > 0) {
          toast.success('강의가 성공적으로 삭제되었습니다.');
          return true;
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting lecture:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error(error.message);
        toast.error('강의 삭제 중 오류가 발생했습니다.');
      }
    }
    return false;
  }

  async getByType(type) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "cohort_number" } },
          { field: { Name: "category" } },
          { field: { Name: "embed_link" } },
          { field: { Name: "sort_order" } },
          { field: { Name: "type" } }
        ],
        where: [
          {
            FieldName: "type",
            Operator: "EqualTo",
            Values: [type]
          }
        ],
        orderBy: [
          {
            fieldName: "sort_order",
            sorttype: "ASC"
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
      console.error('Error fetching lectures by type:', error);
      return [];
    }
  }

  async getMasterLectures(courseType, userCohort) {
    try {
      let params;

      if (courseType === "공통 과정") {
        params = {
          fields: [
            { field: { Name: "Name" } },
            { field: { Name: "title" } },
            { field: { Name: "cohort_number" } },
            { field: { Name: "category" } },
            { field: { Name: "embed_link" } },
            { field: { Name: "sort_order" } },
            { field: { Name: "type" } }
          ],
          where: [
            {
              FieldName: "type",
              Operator: "EqualTo",
              Values: ["master_common"]
            }
          ],
          orderBy: [
            {
              fieldName: "sort_order",
              sorttype: "ASC"
            }
          ]
        };
      } else {
        const numCohort = parseInt(userCohort) || 0;
        params = {
          fields: [
            { field: { Name: "Name" } },
            { field: { Name: "title" } },
            { field: { Name: "cohort_number" } },
            { field: { Name: "category" } },
            { field: { Name: "embed_link" } },
            { field: { Name: "sort_order" } },
            { field: { Name: "type" } }
          ],
          where: [
            {
              FieldName: "type",
              Operator: "EqualTo",
              Values: ["master"]
            },
            {
              FieldName: "cohort_number",
              Operator: "EqualTo",
              Values: [numCohort]
            }
          ],
          orderBy: [
            {
              fieldName: "sort_order",
              sorttype: "ASC"
            }
          ]
        };
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching master lectures:', error);
      return [];
    }
  }

  async getByCohort(cohortNumber) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "cohort_number" } },
          { field: { Name: "category" } },
          { field: { Name: "embed_link" } },
          { field: { Name: "sort_order" } },
          { field: { Name: "type" } }
        ],
        where: [
          {
            FieldName: "cohort_number",
            Operator: "EqualTo",
            Values: [parseInt(cohortNumber)]
          }
        ],
        orderBy: [
          {
            fieldName: "sort_order",
            sorttype: "ASC"
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
      console.error('Error fetching lectures by cohort:', error);
      return [];
    }
  }

  async getByMembershipCohort(cohortNumber) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "cohort_number" } },
          { field: { Name: "category" } },
          { field: { Name: "embed_link" } },
          { field: { Name: "sort_order" } },
          { field: { Name: "type" } }
        ],
        where: [
          {
            FieldName: "type",
            Operator: "EqualTo",
            Values: ["membership"]
          },
          {
            FieldName: "cohort_number",
            Operator: "LessThanOrEqualTo",
            Values: [parseInt(cohortNumber)]
          }
        ],
        orderBy: [
          {
            fieldName: "sort_order",
            sorttype: "ASC"
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
      console.error('Error fetching membership lectures by cohort:', error);
      return [];
    }
  }
}

export const lectureService = new LectureService();

export default lectureService;