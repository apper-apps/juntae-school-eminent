import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem("juntae_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication - in real app, this would call Apper Auth
      const mockUser = {
        id: "user_" + Date.now(),
        email,
        name: email.split("@")[0],
        role: "free",
        is_admin: false,
        membership_cohort: 0,
        master_cohort: 0,
        created_at: new Date().toISOString()
      };

      setUser(mockUser);
      localStorage.setItem("juntae_user", JSON.stringify(mockUser));
      setIsAuthModalOpen(false);
      toast.success("로그인 성공!");
      
      return { success: true };
    } catch (error) {
      toast.error("로그인에 실패했습니다.");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, name) => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock registration - in real app, this would call Apper Auth
      const mockUser = {
        id: "user_" + Date.now(),
        email,
        name,
        role: "free",
        is_admin: false,
        membership_cohort: 0,
        master_cohort: 0,
        created_at: new Date().toISOString()
      };

      setUser(mockUser);
      localStorage.setItem("juntae_user", JSON.stringify(mockUser));
      setIsAuthModalOpen(false);
      toast.success("회원가입 성공! 환영합니다!");
      
      return { success: true };
    } catch (error) {
      toast.error("회원가입에 실패했습니다.");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("juntae_user");
    toast.success("로그아웃되었습니다.");
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const hasAccess = (requiredRole = null, requiredCohort = null) => {
    if (!user) return false;
    
    if (user.is_admin) return true;
    
    if (requiredRole && user.role !== requiredRole) return false;
    
    if (requiredCohort) {
      const userCohort = requiredCohort === "membership" 
        ? user.membership_cohort 
        : user.master_cohort;
      return userCohort > 0;
    }
    
    return true;
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    openAuthModal,
    closeAuthModal,
    isAuthModalOpen,
    hasAccess
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};