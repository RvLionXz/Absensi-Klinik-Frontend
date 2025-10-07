import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { AdminLayout } from "./components/layout/AdminLayout";
import { AdminAbsensiPage } from "./pages/admin/AdminAbsensiPage";
import { AdminUsersPage } from "./pages/admin/AdminUsersPage";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { AdminRoute } from "./components/common/AdminRoute";

function App() {
	const { isAuthenticated, user } = useAuth();

	return (
		<Router>
			<Routes>
				<Route path="/login" element={<LoginPage />} />

				<Route
					path="/dashboard"
					element={
						<ProtectedRoute>
							<DashboardPage />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/admin"
					element={
						<AdminRoute>
							<AdminLayout />
						</AdminRoute>
					}
				>
					<Route index element={<Navigate to="absensi" replace />} />
					<Route path="absensi" element={<AdminAbsensiPage />} />
					<Route path="users" element={<AdminUsersPage />} />
				</Route>

				<Route
					path="/"
					element={
						!isAuthenticated ? (
							<Navigate to="/login" />
						) : user?.role === "admin" ? (
							<Navigate to="/admin/absensi" />
						) : (
							<Navigate to="/dashboard" />
						)
					}
				/>
			</Routes>
			<Toaster />
		</Router>
	);
}

export default App;
