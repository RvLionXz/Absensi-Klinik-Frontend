import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./components/common/ProtectedRoute";

export function AppRoutes() {
	const { isAuthenticated } = useAuth();

	return (
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
				path="/"
				element={
					isAuthenticated ? (
						<Navigate to="/dashboard" />
					) : (
						<Navigate to="/login" />
					)
				}
			/>
		</Routes>
	);
}