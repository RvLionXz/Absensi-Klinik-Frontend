import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react()],
	server: {
		allowedHosts: [".ngrok-free.app"],
		proxy: {
			"/api": {
				target: "http://47.250.187.233:4000", // backend kamu
				changeOrigin: true,
				secure: false,
			},
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
