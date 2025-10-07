import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function LoginForm() {
	const navigate = useNavigate();
	const { login } = useAuth();
	const { toast } = useToast();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const getDeviceId = () => {
		let deviceId = localStorage.getItem("deviceId");
		if (!deviceId) {
			deviceId = crypto.randomUUID();
			localStorage.setItem("deviceId", deviceId);
		}
		return deviceId;
	};

	const handleLogin = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			const device_id = getDeviceId();
			await login(username, password, device_id);
			toast({
				title: "Login Berhasil!",
				description: "Anda akan diarahkan ke dashboard.",
				className: "bg-green-500 text-white",
			});
			navigate("/dashboard");
		} catch (err) {
			const errorMessage =
				err.response?.data?.message || "Terjadi kesalahan. Coba lagi.";
			setError(errorMessage);
			toast({
				title: "Login Gagal",
				description: errorMessage,
				variant: "destructive",
			});
			setIsLoading(false);
		}
	};

	const formVariants = {
		hidden: { opacity: 0, scale: 0.95 },
		visible: {
			opacity: 1,
			scale: 1,
			transition: {
				staggerChildren: 0.1,
				duration: 0.3,
			},
		},
	};

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: {
				duration: 0.5,
				ease: "easeOut",
			},
		},
	};

	return (
		<motion.div
			variants={formVariants}
			initial="hidden"
			animate="visible"
			className="w-full max-w-sm lg:max-w-lg"
		>
			<Card
				className="
        bg-transparent lg:bg-white/60 lg:backdrop-blur-xl
        border-none lg:border lg:border-white/30
        shadow-none lg:shadow-2xl lg:shadow-primary/10
        rounded-none lg:rounded-3xl
      "
			>
				<CardHeader className="p-0 lg:p-10 lg:pt-12">
					<motion.div variants={itemVariants}>
						<CardTitle className="text-3xl font-bold text-primary-dark">
							Selamat Datang👋
						</CardTitle>
					</motion.div>
					<motion.div variants={itemVariants}>
						<CardDescription className="text-gray-500 pt-1 text-md">
							Silahkan Masukan Username Dan Password.
						</CardDescription>
					</motion.div>
				</CardHeader>
				<CardContent className="p-0 pt-8 lg:p-10 lg:pt-0">
					<form onSubmit={handleLogin} className="grid gap-6">
						<motion.div variants={itemVariants} className="grid gap-2">
							<Label htmlFor="username">Username</Label>
							<motion.div whileFocus={{ scale: 1.02 }} className="relative">
								<User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
								<Input
									id="username"
									type="text"
									placeholder="contoh: Sipulan"
									required
									className="pl-11 py-6 rounded-xl border-gray-300/50 focus-visible:ring-primary"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
								/>
							</motion.div>
						</motion.div>

						<motion.div variants={itemVariants} className="grid gap-2">
							<div className="flex items-center">
								<Label htmlFor="password">Password</Label>
							</div>
							<motion.div whileFocus={{ scale: 1.02 }} className="relative">
								<Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
								<Input
									id="password"
									type={showPassword ? "text" : "password"}
									required
									className="pl-11 pr-10 py-6 rounded-xl border-gray-300/50 focus-visible:ring-primary"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 hover:text-primary"
								>
									{showPassword ? <EyeOff /> : <Eye />}
								</button>
							</motion.div>
						</motion.div>

						{error && (
							<motion.div
								variants={itemVariants}
								className="text-red-500 text-sm text-center bg-red-100 p-3 rounded-lg"
							>
								{error}
							</motion.div>
						)}

						<motion.div variants={itemVariants}>
							<Button
								type="submit"
								disabled={isLoading}
								className="w-full text-lg py-6 rounded-xl text-white font-semibold bg-gradient-to-r from-primary to-[#154b64] hover:shadow-lg hover:shadow-primary/40 transition-all duration-300 ease-in-out transform hover:-translate-y-1"
							>
								{isLoading ? (
									<Loader2 className="mr-2 h-6 w-6 animate-spin" />
								) : (
									"Sign In"
								)}
							</Button>
						</motion.div>
					</form>
					<motion.div
						variants={itemVariants}
						className="mt-8 text-center text-sm"
					>
						<span className="text-gray-500">Dikembangkan Oleh </span>
						<a href="https://rvlionxz.github.io" className="font-semibold text-primary hover:underline">
							 RvLionXz
						</a>
					</motion.div>
				</CardContent>
			</Card>
		</motion.div>
	);
}
