import axios from "axios";

const API_BASE_URL = "https://rvlionxz.my.id/api/";

const apiClient = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"ngrok-skip-browser-warning": "true",
	},
});

apiClient.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers["Authorization"] = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default apiClient;
