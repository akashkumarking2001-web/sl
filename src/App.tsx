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
const DirectShoppingTest = lazy(() => import("./pages/DirectShoppingTest"));
const DebugProducts = lazy(() => import("./pages/DebugProducts"));

const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminForgotPassword = lazy(() => import("./pages/AdminForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const SubmitCoursePage = lazy(() => import("./pages/affiliate/SubmitCoursePage"));
const CourseDetailPage = lazy(() => import("./pages/CourseDetailPage"));
const PackageDetailPage = lazy(() => import("./pages/PackageDetailPage"));

const queryClient = new QueryClient();

// Loading fallback component with skeleton
const PageLoader = () => (
  <div className="min-h-screen bg-background">
    {/* Navbar skeleton */}
    <div className="h-20 border-b border-border/50 px-4 flex items-center justify-between">
      <Skeleton className="h-10 w-32" variant="shimmer" />
      <div className="hidden lg:flex items-center gap-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-4 w-16" variant="shimmer" />
        ))}
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-20" variant="shimmer" />
        <Skeleton className="h-9 w-24" variant="shimmer" />
      </div>
    </div>

    {/* Content skeleton */}
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center gap-6">
        <Skeleton className="h-8 w-48" variant="shimmer" />
        <Skeleton className="h-4 w-96 max-w-full" variant="shimmer" />
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mt-8" />
      </div>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <ReferralNotificationProvider>
              <Suspense fallback={<PageLoader />}>
                <PageTransition>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/registration-success" element={<RegistrationSuccess />} />
                    <Route path="/payment" element={<PaymentGateway />} />
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
                    <Route path="/test-shop" element={<DirectShoppingTest />} />
                    <Route path="/debug-shop" element={<DebugProducts />} />
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

                    {/* Admin Routes */}
                    <Route path="/admin" element={
                      <ProtectedRoute requireAdmin={true}>
                        <SkillLearnersAdmin />
                      </ProtectedRoute>
                    } />

                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </PageTransition>
              </Suspense>
              <AIChatbot />
            </ReferralNotificationProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
