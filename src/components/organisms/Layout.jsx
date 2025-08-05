import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/organisms/Header";
import UpgradeBanner from "@/components/organisms/UpgradeBanner";

const Layout = ({ children }) => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <main className="relative">
        {children}
        <UpgradeBanner />
      </main>
    </div>
  );
};

export default Layout;