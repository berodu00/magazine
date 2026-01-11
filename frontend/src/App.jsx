import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import MainPage from './pages/main/MainPage';
import ArticleListPage from './pages/magazine/ArticleListPage';
import ArticleDetailPage from './pages/magazine/ArticleDetailPage';
import AdminLayout from './pages/admin/AdminLayout';
import ArticleManagePage from './pages/admin/ArticleManagePage';
import ArticleCreatePage from './pages/admin/ArticleCreatePage';
import ArticleEditPage from './pages/admin/ArticleEditPage';
import ResourceManagePage from './pages/admin/ResourceManagePage';
import CategoryManagePage from './pages/admin/CategoryManagePage';
import EventListPage from './pages/event/EventListPage';
import EventDetailPage from './pages/event/EventDetailPage';
import EventManagePage from './pages/admin/EventManagePage';
import EventCreatePage from './pages/admin/EventCreatePage';
import IdeaManagePage from './pages/admin/IdeaManagePage';
import MyIdeaPage from './pages/user/MyIdeaPage';
import IdeaFloatingButton from './components/user/IdeaFloatingButton';
import PopupManagePage from './pages/admin/PopupManagePage';
import BannerManagePage from './pages/admin/BannerManagePage';
import DashboardPage from './pages/admin/DashboardPage';
import NewsletterCreatePage from './pages/admin/NewsletterCreatePage';
import SocialPage from './pages/social/SocialPage';
import SocialDetailPage from './pages/social/SocialDetailPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainPage />
                <IdeaFloatingButton />
              </ProtectedRoute>
            }
          />

          <Route
            path="/articles"
            element={
              <ProtectedRoute>
                <ArticleListPage />
                <IdeaFloatingButton />
              </ProtectedRoute>
            }
          />

          <Route
            path="/articles/:id"
            element={
              <ProtectedRoute>
                <ArticleDetailPage />
                <IdeaFloatingButton />
              </ProtectedRoute>
            }
          />
          <Route
            path="/social"
            element={
              <ProtectedRoute>
                <SocialPage />
                <IdeaFloatingButton />
              </ProtectedRoute>
            }
          />
          <Route
            path="/social/:platform/:id"
            element={
              <ProtectedRoute>
                <SocialDetailPage />
                <IdeaFloatingButton />
              </ProtectedRoute>
            }
          />



          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <EventListPage />
                <IdeaFloatingButton />
              </ProtectedRoute>
            }
          />

          <Route
            path="/events/:id"
            element={
              <ProtectedRoute>
                <EventDetailPage />
                <IdeaFloatingButton />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-ideas"
            element={
              <ProtectedRoute>
                <MyIdeaPage />
                <IdeaFloatingButton />
              </ProtectedRoute>
            }
          />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="articles" element={<ArticleManagePage />} />
            <Route path="articles/create" element={<ArticleCreatePage />} />
            <Route path="articles/edit/:id" element={<ArticleEditPage />} />
            <Route path="resources" element={<ResourceManagePage />} />
            <Route path="categories" element={<CategoryManagePage />} />
            <Route path="events" element={<EventManagePage />} />
            <Route path="events/create" element={<EventCreatePage />} />
            <Route path="ideas" element={<IdeaManagePage />} />
            <Route path="newsletters" element={<NewsletterCreatePage />} />
            <Route path="popups" element={<PopupManagePage />} />
            <Route path="banners" element={<BannerManagePage />} />
            <Route path="dashboard" element={<DashboardPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
