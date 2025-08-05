import { useAuth } from "@/hooks/useAuth";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import NavItem from "@/components/molecules/NavItem";
import Logo from "@/components/molecules/Logo";

const MobileMenu = ({ isOpen, onClose, navItems }) => {
  const { user, openAuthModal, logout } = useAuth();

  const handleNavClick = () => {
    onClose();
  };

  const handleAuthClick = () => {
    if (user) {
      logout();
    } else {
      openAuthModal();
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-80 max-w-[80vw] bg-slate-900 border-l border-slate-700 shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <Logo />
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-300 hover:text-slate-100 hover:bg-slate-800 transition-colors duration-200"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <NavItem 
                key={item.path} 
                to={item.path}
                onClick={handleNavClick}
                className="block w-full text-left"
              >
                {item.label}
              </NavItem>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="p-4 border-t border-slate-700">
            {user ? (
              <div className="space-y-3">
                <p className="text-sm text-slate-300">
                  안녕하세요, {user.name}님
                </p>
                <Button 
                  variant="outline" 
                  onClick={handleAuthClick}
                  className="w-full"
                >
                  로그아웃
                </Button>
              </div>
            ) : (
              <Button 
                onClick={handleAuthClick}
                className="w-full"
              >
                로그인
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;