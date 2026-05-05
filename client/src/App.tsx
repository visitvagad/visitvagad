import { BrowserRouter, Routes, Route } from "react-router-dom"
import { lazy, Suspense } from "react"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import Navbar from "./components/Navbar"
import ProtectedRoute from "./components/ProtectedRoute"
import RoleRoute from "./components/RoleRoute"
import Loader from "./components/common/Loader"

const ExplorePage = lazy(() => import("./pages/ExplorePage"))
const DashboardPage = lazy(() => import("./pages/DashboardPage"))

// Admin Pages
const AdminLayout = lazy(() => import("./admin/components/AdminLayout"))
const AdminDashboard = lazy(() => import("./admin/pages/AdminDashboard"))
const DestinationsPage = lazy(() => import("./admin/pages/DestinationsPage"))
const DestinationForm = lazy(() => import("./admin/pages/DestinationForm"))
const HotelsPage = lazy(() => import("./admin/pages/HotelsPage"))
const HotelForm = lazy(() => import("./admin/pages/HotelForm"))
const EventsPage = lazy(() => import("./admin/pages/EventsPage"))
const EventForm = lazy(() => import("./admin/pages/EventForm"))
const FoodPage = lazy(() => import("./admin/pages/FoodPage"))
const FoodForm = lazy(() => import("./admin/pages/FoodForm"))
const ItinerariesPage = lazy(() => import("./admin/pages/ItinerariesPage"))
const ItineraryForm = lazy(() => import("./admin/pages/ItineraryForm"))
const MediaPage = lazy(() => import("./admin/pages/MediaPage"))
import { UsersPage, SettingsPage } from "./admin/pages/AdminOnlyPages"

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <RoleRoute allowedRoles={["admin", "editor"]}>
              <AdminLayout />
            </RoleRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="destinations" element={<DestinationsPage />} />
            <Route path="destinations/new" element={<DestinationForm />} />
            <Route path="destinations/edit/:id" element={<DestinationForm />} />
            <Route path="hotels" element={<HotelsPage />} />
            <Route path="hotels/new" element={<HotelForm />} />
            <Route path="hotels/edit/:id" element={<HotelForm />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="events/new" element={<EventForm />} />
            <Route path="events/edit/:id" element={<EventForm />} />
            <Route path="food" element={<FoodPage />} />
            <Route path="food/new" element={<FoodForm />} />
            <Route path="food/edit/:id" element={<FoodForm />} />
            <Route path="itineraries" element={<ItinerariesPage />} />
            <Route path="itineraries/new" element={<ItineraryForm />} />
            <Route path="itineraries/edit/:id" element={<ItineraryForm />} />
            <Route path="media" element={<MediaPage />} />
            <Route path="users" element={
              <RoleRoute allowedRoles={["admin"]}>
                <UsersPage />
              </RoleRoute>
            } />
            <Route path="settings" element={
              <RoleRoute allowedRoles={["admin"]}>
                <SettingsPage />
              </RoleRoute>
            } />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App