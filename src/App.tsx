import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import SkillLearnersAdmin from "@/pages/admin/SkillLearnersAdmin";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import AIChatbot from "@/components/AIChatbot";
import PageTransition from "@/components/PageTransition";
import { Skeleton } from "@/components/ui/skeleton";
import ReferralNotificationProvider from "@/components/ReferralNotificationProvider";
import { CartProvider } from "@/context/CartContext";
import MobileAppInitializer from "@/components/MobileAppInitializer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import MobileSimulator from "@/components/MobileSimulator";

// Lazy load route components for code splitting
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const NotFound = lazy(() => import("./pages/NotFound"));
const UserHome = lazy(() => import("./pages/UserHome"));
const AffiliateDashboard = lazy(() => import("./pages/AffiliateDashboard"));
const UserCourses = lazy(() => import("./pages/UserCourses"));
const RegistrationSuccess = lazy(() => import("./pages/RegistrationSuccess"));
const PaymentGateway = lazy(() => import("./pages/PaymentGateway"));
const LearnersPage = lazy(() => import("./pages/affiliate/LearnersPage"));
const IncomeReportPage = lazy(() => import("./pages/affiliate/IncomeReportPage"));
const WalletPage = lazy(() => import("./pages/affiliate/WalletPage"));
const LeaderboardPage = lazy(() => import("./pages/affiliate/LeaderboardPage"));
const AnalyticsPage = lazy(() => import("./pages/affiliate/AnalyticsPage"));
const TasksPage = lazy(() => import("./pages/affiliate/TasksPage"));
const ProfilePage = lazy(() => import("./pages/affiliate/ProfilePage"));
const NetworkPage = lazy(() => import("./pages/affiliate/NetworkPage"));
const MatrixPage = lazy(() => import("./pages/affiliate/MatrixPage"));
const ShoppingWrapper = lazy(() => import("./pages/ShoppingWrapper"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const AffiliateApplicationPage = lazy(() => import("./pages/AffiliateApplicationPage"));
const AffiliateEarningsPage = lazy(() => import("./pages/AffiliateEarningsPage"));
const MyOrdersPage = lazy(() => import("./pages/MyOrdersPage"));
const WishlistPage = lazy(() => import("./pages/WishlistPage"));
const UserOrders = lazy(() => import("./pages/UserOrders"));
const ShoppingWalletPage = lazy(() => import("./pages/ShoppingWalletPage"));
const AddressesPage = lazy(() => import("./pages/AddressesPage"));
const ShoppingProfilePage = lazy(() => import("./pages/ShoppingProfilePage"));
const PaymentProof = lazy(() => import("./pages/PaymentProof"));

const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminForgotPassword = lazy(() => import("./pages/AdminForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const SubmitCoursePage = lazy(() => import("./pages/affiliate/SubmitCoursePage"));
const CourseDetailPage = lazy(() => import("./pages/CourseDetailPage"));
const PackageDetailPage = lazy(() => import("./pages/PackageDetailPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const PlansPage = lazy(() => import("./pages/PlansPage"));
const AllCoursesPage = lazy(() => import("./pages/AllCoursesPage"));

import { useState, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center">
    <div className="w-full max-w-md p-6 space-y-8 animate-pulse">
      <div className="flex justify-between items-center mb-12">
        <Skeleton className="h-10 w-32 rounded-xl" variant="shimmer" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-10 rounded-full" variant="shimmer" />
          <Skeleton className="h-10 w-10 rounded-full" variant="shimmer" />
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-48 w-full rounded-[2rem]" variant="shimmer" />
        <div className="grid grid-cols-4 gap-4">
          <Skeleton className="h-16 w-full rounded-2xl" variant="shimmer" />
          <Skeleton className="h-16 w-full rounded-2xl" variant="shimmer" />
          <Skeleton className="h-16 w-full rounded-2xl" variant="shimmer" />
          <Skeleton className="h-16 w-full rounded-2xl" variant="shimmer" />
        </div>
      </div>
      <div className="flex gap-4 mt-8">
        <Skeleton className="h-9 w-20" variant="shimmer" />
        <Skeleton className="h-9 w-24" variant="shimmer" />
      </div>
    </div>
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center gap-6">
        <Skeleton className="h-8 w-48" variant="shimmer" />
        <Skeleton className="h-4 w-96 max-w-full" variant="shimmer" />
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mt-8" />
      </div>
    </div>
  </div>
);

const App = () => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization or wait for essential data
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2500); // Show branded splash for at least 2.5s for premium feel

    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {isInitialLoading && <SplashScreen />}
        <Toaster />
        <Sonner />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <AuthProvider>
            <MobileAppInitializer />
            <CartProvider>
              <ReferralNotificationProvider>
                <MobileSimulator>
                  <Suspense fallback={<PageLoader />}>
                    <PageTransition>
                      <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Index />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/registration-success" element={<RegistrationSuccess />} />
                        <Route path="/payment" element={<PaymentGateway />} />
                        <Route path="/payment-proof" element={<PaymentProof />} />
                        <Route path="/course/:courseId" element={<CourseDetailPage />} />
                        <Route path="/package/:packageId" element={<PackageDetailPage />} />
                        <Route path="/admin-login" element={<AdminLogin />} />
                        <Route path="/admin-forgot-password" element={<AdminForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />

                        {/* Protected Routes */}
                        <Route path="/user-home" element={
                          <ProtectedRoute>
                            <UserHome />
                          </ProtectedRoute>
                        } />
                        <Route path="/dashboard/affiliate" element={
                          <ProtectedRoute>
                            <AffiliateDashboard />
                          </ProtectedRoute>
                        } />
                        <Route path="/dashboard/courses" element={
                          <ProtectedRoute>
                            <UserCourses />
                          </ProtectedRoute>
                        } />
                        <Route path="/dashboard/learners" element={
                          <ProtectedRoute>
                            <LearnersPage />
                          </ProtectedRoute>
                        } />
                        <Route path="/dashboard/income/:type" element={
                          <ProtectedRoute>
                            <IncomeReportPage />
                          </ProtectedRoute>
                        } />
                        <Route path="/dashboard/wallet" element={
                          <ProtectedRoute>
                            <WalletPage />
                          </ProtectedRoute>
                        } />
                        <Route path="/dashboard/leaderboard" element={
                          <ProtectedRoute>
                            <LeaderboardPage />
                          </ProtectedRoute>
                        } />
                        <Route path="/dashboard/analytics" element={
                          <ProtectedRoute>
                            <AnalyticsPage />
                          </ProtectedRoute>
                        } />
                        <Route path="/dashboard/network" element={
                          <ProtectedRoute>
                            <NetworkPage />
                          </ProtectedRoute>
                        } />
                        <Route path="/dashboard/matrix" element={
                          <ProtectedRoute>
                            <MatrixPage />
                          </ProtectedRoute>
                        } />
                        <Route path="/dashboard/tasks" element={
                          <ProtectedRoute>
                            <TasksPage />
                          </ProtectedRoute>
                        } />
                        <Route path="/dashboard/profile" element={
                          <ProtectedRoute>
                            <ProfilePage />
                          </ProtectedRoute>
                        } />
                        <Route path="/dashboard/submit-course" element={
                          <ProtectedRoute>
                            <SubmitCoursePage />
                          </ProtectedRoute>
                        } />
                        {/* Shopping & E-Commerce Routes */}
                        <Route path="/shopping" element={<ShoppingWrapper />} />
                        <Route path="/shopping/cart" element={<CartPage />} />
                        <Route path="/product/:slug" element={<ProductDetailPage />} />
                        <Route path="/affiliate-program" element={<AffiliateApplicationPage />} />
                        <Route path="/dashboard/affiliate-earnings" element={
                          <ProtectedRoute>
                            <AffiliateEarningsPage />
                          </ProtectedRoute>
                        } />

                        <Route path="/dashboard/shopping" element={
                          <ProtectedRoute>
                            <ShoppingWrapper />
                          </ProtectedRoute>
                        } />
                        <Route path="/dashboard/my-orders" element={
                          <ProtectedRoute>
                            <MyOrdersPage />
                          </ProtectedRoute>
                        } />
                        <Route path="/dashboard/wishlist" element={
                          <ProtectedRoute>
                            <WishlistPage />
                          </ProtectedRoute>
                        } />
                        <Route path="/dashboard/orders" element={
                          <ProtectedRoute>
                            <UserOrders />
                          </ProtectedRoute>
                        } />
                        <Route path="/dashboard/shopping-wallet" element={
                          <ProtectedRoute>
                            <ShoppingWalletPage />
                          </ProtectedRoute>
                        } />
                        <Route path="/dashboard/addresses" element={
                          <ProtectedRoute>
                            <AddressesPage />
                          </ProtectedRoute>
                        } />
                        <Route path="/dashboard/shopping-profile" element={
                          <ProtectedRoute>
                            <ShoppingProfilePage />
                          </ProtectedRoute>
                        } />

                        {/* Admin Routes */}
                        <Route path="/admin" element={
                          <ProtectedRoute requireAdmin={true}>
                            <SkillLearnersAdmin />
                          </ProtectedRoute>
                        } />

                        <Route path="/plans" element={<PlansPage />} />
                        <Route path="/courses" element={<AllCoursesPage />} />

                        {/* 404 */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </PageTransition>
                  </Suspense>
                </MobileSimulator>
                <AIChatbot />
                <MobileBottomNav />
              </ReferralNotificationProvider>
            </CartProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
