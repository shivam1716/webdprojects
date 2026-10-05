import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'

import PublicLayout from '../layouts/PublicLayout'
import AuthLayout from '../layouts/AuthLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import DemoDashboardLayout from '../layouts/DemoDashboardLayout'
import ProtectedRoute from '../components/auth/ProtectedRoute'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const LandingPage = lazy(() => import('../pages/LandingPage'))
const LoginPage = lazy(() => import('../pages/LoginPage'))
const RegisterPage = lazy(() => import('../pages/RegisterPage'))
const DashboardPage = lazy(() => import('../pages/DashboardPage'))
const ProjectsPage = lazy(() => import('../pages/ProjectsPage'))
const UploadPage = lazy(() => import('../pages/UploadPage'))
const AnalysisPage = lazy(() => import('../pages/AnalysisPage'))
const ReportsPage = lazy(() => import('../pages/ReportsPage'))
const ChatPage = lazy(() => import('../pages/ChatPage'))
const ProfilePage = lazy(() => import('../pages/ProfilePage'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))
const DemoDashboardPage = lazy(() => import('../pages/DemoDashboardPage'))

const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
)

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public marketing site */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>

        {/* Auth — no logic wired up yet, navigates straight through */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Authenticated app shell */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/analysis/:projectId?" element={<AnalysisPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Demo route */}
        <Route element={<DemoDashboardLayout />}>
          <Route path="/demo" element={<DemoDashboardPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
