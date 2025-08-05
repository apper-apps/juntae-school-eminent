import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { usersExtService } from '@/services/usersExtService';

export const useUserRole = () => {
  const { user: authUser, isAuthenticated } = useSelector((state) => state.user);
  
  const [userRole, setUserRole] = useState({
    role: 'free',
    is_admin: false,
    membership_cohort: 0,
    master_cohort: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!isAuthenticated || !authUser?.id) {
        setUserRole({
          role: 'free',
          is_admin: false,
          membership_cohort: 0,
          master_cohort: 0
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const usersExtRecord = await usersExtService.findByAuthId(authUser.id);
        
        if (usersExtRecord) {
          setUserRole({
            role: usersExtRecord.role || 'free',
            is_admin: usersExtRecord.is_admin || false,
            membership_cohort: usersExtRecord.membership_cohort || 0,
            master_cohort: usersExtRecord.master_cohort || 0
          });
        } else {
          // Fallback to default values if no record found
          setUserRole({
            role: 'free',
            is_admin: false,
            membership_cohort: 0,
            master_cohort: 0
          });
        }
      } catch (err) {
        console.error('Error fetching user role:', err);
        setError(err.message);
        // Set default values on error
        setUserRole({
          role: 'free',
          is_admin: false,
          membership_cohort: 0,
          master_cohort: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [authUser, isAuthenticated]);

  // Refresh function to refetch user role data
  const refreshUserRole = async () => {
    if (!isAuthenticated || !authUser?.id) return;
    
    try {
      setLoading(true);
      const usersExtRecord = await usersExtService.findByAuthId(authUser.id);
      
      if (usersExtRecord) {
        setUserRole({
          role: usersExtRecord.role || 'free',
          is_admin: usersExtRecord.is_admin || false,
          membership_cohort: usersExtRecord.membership_cohort || 0,
          master_cohort: usersExtRecord.master_cohort || 0
        });
      }
    } catch (err) {
      console.error('Error refreshing user role:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to check access based on role and cohort
  const hasAccess = (requiredRole = null, requiredCohort = null) => {
    if (!isAuthenticated) return false;
    
    if (userRole.is_admin) return true;
    
    if (requiredRole && userRole.role !== requiredRole && userRole.role !== 'both') return false;
    
    if (requiredCohort) {
      const userCohort = requiredCohort === "membership" 
        ? userRole.membership_cohort 
        : userRole.master_cohort;
      return userCohort > 0;
    }
    
    return true;
  };

  return {
    ...userRole,
    loading,
    error,
    refreshUserRole,
    hasAccess,
    isAuthenticated
  };
};

export default useUserRole;