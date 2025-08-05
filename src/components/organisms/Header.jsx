import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import NavItem from "@/components/molecules/NavItem";
import Logo from "@/components/molecules/Logo";
import MobileMenu from "@/components/organisms/MobileMenu";
import AuthModal from "@/components/organisms/AuthModal";
const Header = () => {
  const { user, openAuthModal, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

const navItems = [
    { path: "/", label: "홈" },
    { path: "/membership", label: "멤버십 영상실" },
    { path: "/master", label: "마스터 과정" },
    { path: "/money-insight", label: "머니 인사이트" },
    { path: "/lectures", label: "강의 관리" },
    { path: "/reviews", label: "리뷰 · 후기" },
    { path: "/profile", label: "프로필" }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Logo />

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <NavItem key={item.path} to={item.path}>
                  {item.label}
                </NavItem>
              ))}
            </nav>

            {/* Desktop Auth Button */}
            <div className="hidden md:flex items-center space-x-3">
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-slate-300">
                    안녕하세요, {user.name}님
                  </span>
                  <Button variant="outline" size="sm" onClick={logout}>
                    로그아웃
                  </Button>
                </div>
              ) : (
                <Button onClick={openAuthModal}>
                  로그인
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg text-slate-300 hover:text-slate-100 hover:bg-slate-800 transition-colors duration-200"
            >
              <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
navItems={navItems}
      />

      {/* Auth Modal */}
      <AuthModal />
    </>
  );
};

export default Header;