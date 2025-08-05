import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import HomePage from "@/components/pages/HomePage";
import MembershipPage from "@/components/pages/MembershipPage";
import MasterPage from "@/components/pages/MasterPage";
import MoneyInsightPage from "@/components/pages/MoneyInsightPage";
import ReviewsPage from "@/components/pages/ReviewsPage";
import ProfilePage from "@/components/pages/ProfilePage";
import AuthModal from "@/components/organisms/AuthModal";
import { AuthProvider } from "@/hooks/useAuth";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-slate-950">
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/membership" element={<MembershipPage />} />
              <Route path="/master" element={<MasterPage />} />
              <Route path="/money-insight" element={<MoneyInsightPage />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </Layout>
          <AuthModal />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;