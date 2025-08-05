import "@/index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import React from "react";
import AuthModal from "@/components/organisms/AuthModal";
import Layout from "@/components/organisms/Layout";
import MoneyInsightPage from "@/components/pages/MoneyInsightPage";
import PostDetailPage from "@/components/pages/PostDetailPage";
import MasterPage from "@/components/pages/MasterPage";
import HomePage from "@/components/pages/HomePage";
import MembershipPage from "@/components/pages/MembershipPage";
import LecturesPage from "@/components/pages/LecturesPage";
import ProfilePage from "@/components/pages/ProfilePage";
import ReviewsPage from "@/components/pages/ReviewsPage";
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
              <Route path="/money-insight/:id" element={<PostDetailPage />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/lectures" element={<LecturesPage />} />
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