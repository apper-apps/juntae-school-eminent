import { toast } from 'react-toastify';

class UsersExtService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'usersext';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "auth_id" } },
          { field: { Name: "email" } },
          { field: { Name: "role" } },
          { field: { Name: "is_admin" } },
          { field: { Name: "membership_cohort" } },
          { field: { Name: "master_cohort" } }
        ],
        orderBy: [
          {
            fieldName: "CreatedOn",
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
        console.error("Error fetching users:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error(error.message);
        toast.error('사용자 정보를 불러오는 중 오류가 발생했습니다.');
      }
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "auth_id" } },
          { field: { Name: "email" } },
          { field: { Name: "role" } },
          { field: { Name: "is_admin" } },
          { field: { Name: "membership_cohort" } },
          { field: { Name: "master_cohort" } }
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
        console.error(`Error fetching user with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async findByAuthId(authId) {
    try {
      const params = {
        fields: [
          { field: { Name: "auth_id" } },
          { field: { Name: "email" } },
          { field: { Name: "role" } },
          { field: { Name: "is_admin" } },
          { field: { Name: "membership_cohort" } },
          { field: { Name: "master_cohort" } }
        ],
        where: [
          {
            FieldName: "auth_id",
            Operator: "EqualTo",
            Values: [authId]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data && response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      console.error('Error finding user by auth_id:', error);
      return null;
    }
  }

  async create(userData) {
    try {
      // Only include Updateable fields based on schema
      const params = {
        records: [{
          Name: userData.email || 'User', // Use email as Name
          auth_id: userData.auth_id,
          email: userData.email,
          role: userData.role || "free",
          is_admin: userData.is_admin || false,
          membership_cohort: userData.membership_cohort || 0,
          master_cohort: userData.master_cohort || 0
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
          console.error(`Failed to create users ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          return successfulRecords[0].data;
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating user:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error(error.message);
        toast.error('사용자 생성 중 오류가 발생했습니다.');
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
          ...(updateData.email && { 
            Name: updateData.email,
            email: updateData.email 
          }),
          ...(updateData.role !== undefined && { role: updateData.role }),
          ...(updateData.is_admin !== undefined && { is_admin: updateData.is_admin }),
          ...(updateData.membership_cohort !== undefined && { membership_cohort: updateData.membership_cohort }),
          ...(updateData.master_cohort !== undefined && { master_cohort: updateData.master_cohort })
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
          console.error(`Failed to update users ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          toast.success('저장 완료');
          return successfulUpdates[0].data;
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating user:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error(error.message);
        toast.error('사용자 수정 중 오류가 발생했습니다.');
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
          console.error(`Failed to delete users ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulDeletions.length > 0) {
          toast.success('사용자가 성공적으로 삭제되었습니다.');
          return true;
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting user:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error(error.message);
        toast.error('사용자 삭제 중 오류가 발생했습니다.');
      }
    }
    return false;
  }

  async ensureUserRecord(currentUser) {
    try {
      if (!currentUser?.id || !currentUser?.email) {
        console.error('Invalid user data provided to ensureUserRecord');
        return null;
      }

      // Check if user already exists
      const existingUser = await this.findByAuthId(currentUser.id);
      
      if (existingUser) {
        return existingUser;
      }

      // Check if this is the first user (table is empty)
      const allUsers = await this.getAll();
      const isFirstUser = allUsers.length === 0;

      // Create new user record
      const newUserData = {
        auth_id: currentUser.id,
        email: currentUser.email,
        role: "free",
        is_admin: isFirstUser, // First user becomes admin
        membership_cohort: 0,
        master_cohort: 0
      };

      const createdUser = await this.create(newUserData);
      
      if (createdUser && isFirstUser) {
        console.log('First user created and assigned admin privileges');
      }

      return createdUser;
    } catch (error) {
      console.error('Error in ensureUserRecord:', error);
      return null;
    }
  }
}

export const usersExtService = new UsersExtService();
export default usersExtService;