import React, { createContext, useState, useContext, useEffect } from "react";
import apiClient from "@/api/apiClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(() => localStorage.getItem("token"));
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const initializeAuth = () => {
			try {
				const storedToken = localStorage.getItem("token");
				if (storedToken) {
					const payload = JSON.parse(atob(storedToken.split(".")[1]));
					setUser({
						namaLengkap: payload.namaLengkap,
						role: payload.role,
						userId: payload.userId,
					});
					setToken(storedToken);
				}
			} catch (error) {
				console.error("Failed to initialize auth from token:", error);
				localStorage.removeItem("token");
				setUser(null);
				setToken(null);
			} finally {
				setIsLoading(false);
			}
		};
		initializeAuth();
	}, []);

	const login = async (username, password, device_id) => {
		const response = await apiClient.post("/auth/login", {
			username,
			password,
			device_id,
		});
		const { token: newToken, user: userData } = response.data;

		localStorage.setItem("token", newToken);
		setToken(newToken);
		setUser(userData);

		return response.data;
	};

	const logout = () => {
		localStorage.removeItem("token");
		setToken(null);
		setUser(null);
	};

	const value = {
		user,
		token,
		login,
		logout,
		isAuthenticated: !!token,
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === null) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};