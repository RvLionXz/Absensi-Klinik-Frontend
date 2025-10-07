import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/api/apiClient";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	AlertCircle,
	CheckCircle2,
	Loader2,
	LogOut,
	PartyPopper,
	ShieldCheck,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

export function DashboardPage() {
	const { user, logout } = useAuth();
	const { location, isWithinClinicRadius } = useGeolocation();
	const { toast } = useToast();
	const navigate = useNavigate();

	const [absenStatus, setAbsenStatus] = useState("loading");
	const [absensiData, setAbsensiData] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		const checkAbsenStatus = async () => {
			try {
				const timezoneOffset = new Date().getTimezoneOffset();
				const params = { tzOffset: timezoneOffset };
				const response = await apiClient.get(`/absensi/status`, { params });
				setAbsenStatus(response.data.status);
				if (response.data.status === "sudah_absen") {
					setAbsensiData(response.data.data);
				}
			} catch (error) {
				console.error("Gagal memeriksa status absensi:", error);
				setAbsenStatus("error");
				toast({
					title: "Error",
					description: "Gagal memuat status absensi.",
					variant: "destructive",
				});
			}
		};
		checkAbsenStatus();
	}, []);

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	const handleAbsen = async () => {
		if (!location.latitude || !location.longitude) {
			toast({
				title: "Lokasi Belum Siap",
				description:
					"Harap tunggu sebentar hingga lokasi Anda berhasil terdeteksi.",
				variant: "destructive",
			});
			return;
		}

		setIsSubmitting(true);
		try {
			const timezoneOffset = new Date().getTimezoneOffset();
			const payload = {
				koordinat: {
					latitude: location.latitude,
					longitude: location.longitude,
				},
				waktuAbsen: new Date().toISOString(),
				tzOffset: timezoneOffset,
			};

			const response = await apiClient.post("/absensi", payload);
			toast({
				title: "Absensi Berhasil!",
				description: `Kehadiran untuk ${user.namaLengkap} telah direkam.`,
				className: "bg-green-500 text-white",
			});
			setAbsenStatus("sudah_absen");
			setAbsensiData(response.data.data);
		} catch (error) {
			toast({
				title: "Absensi Gagal",
				description:
					error.response?.data?.message || "Terjadi kesalahan pada server.",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		if (!/Z|[+-]\d{2}:\d{2}$/.test(dateString)) {
			date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
		}
		return date.toLocaleString("id-ID", {
			dateStyle: "medium",
			timeStyle: "short",
		});
	};

	const renderLocationStatus = () => {
		if (location.loading) {
			return (
				<div className="flex items-center p-4 mb-6 rounded-md bg-blue-100 text-blue-700">
					<Loader2 className="w-6 h-6 mr-3 animate-spin" />
					<span className="font-semibold">Mendeteksi lokasi...</span>
				</div>
			);
		}
		if (location.error) {
			return (
				<div className="flex items-center p-4 mb-6 rounded-md bg-red-100 text-red-700">
					<AlertCircle className="w-6 h-6 mr-3" />
					<span className="font-semibold">Gagal dapatkan lokasi.</span>
				</div>
			);
		}
		return (
			<div
				className={`flex items-center p-4 mb-6 rounded-md bg-opacity-20 ${
					isWithinClinicRadius
						? "bg-green-500 text-green-700"
						: "bg-red-500 text-red-700"
				}`}
			>
				{isWithinClinicRadius ? (
					<CheckCircle2 className="w-6 h-6 mr-3" />
				) : (
					<AlertCircle className="w-6 h-6 mr-3" />
				)}
				<span className="font-semibold">
					{isWithinClinicRadius
						? "Anda di area klinik"
						: "Anda di luar area klinik"}
				</span>
			</div>
		);
	};

	const renderAbsenContent = () => {
		if (absenStatus === "loading") {
			return (
				<div className="flex justify-center items-center h-40">
					<Loader2 className="w-12 h-12 animate-spin text-primary" />
				</div>
			);
		}
		if (absenStatus === "sudah_absen") {
			if (absensiData && absensiData.waktu_absen) {
				const waktu = formatDate(absensiData.waktu_absen);
				return (
					<div className="text-center py-8">
						<PartyPopper className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-green-500 mb-4" />
						<h3 className="text-xl sm:text-2xl font-bold text-gray-800">
							Anda Sudah Absen Hari Ini!
						</h3>
						<p className="text-gray-500 mt-2">
							Absensi Anda tercatat pada pukul <strong>{waktu}</strong>.
						</p>
						<p className="text-sm text-gray-400 mt-4">
							Terima kasih dan selamat bekerja!
						</p>
					</div>
				);
			} else {
				return (
					<div className="text-center py-8">
						<CheckCircle2 className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-green-500 mb-4" />
						<h3 className="text-xl sm:text-2xl font-bold text-gray-800">
							Anda Sudah Absen Hari Ini!
						</h3>
						<p className="text-gray-500 mt-2">Kehadiran Anda telah tercatat.</p>
					</div>
				);
			}
		}
		if (absenStatus === "belum_absen") {
			return (
				<>
					{renderLocationStatus()}
					<Button
						onClick={handleAbsen}
						disabled={
							!isWithinClinicRadius ||
							location.loading ||
							location.error ||
							isSubmitting
						}
						className="w-full text-lg py-6 rounded-xl text-white font-semibold bg-gradient-to-r from-primary to-[#154b64] hover:shadow-lg hover:shadow-primary/40 transition-all duration-300 ease-in-out transform hover:-translate-y-1 disabled:bg-gray-400 disabled:shadow-none disabled:translate-y-0"
					>
						{isSubmitting ? (
							<Loader2 className="mr-2 h-6 w-6 animate-spin" />
						) : (
							"ABSEN SEKARANG"
						)}
					</Button>
					<div className="text-xs text-muted-foreground mt-4 text-center">
						{location.accuracy &&
							`Akurasi Lokasi: ${location.accuracy.toFixed(2)} meter`}
					</div>
				</>
			);
		}
		return (
			<div className="text-center text-red-500">
				Terjadi error saat memuat data.
			</div>
		);
	};

	return (
		<div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
			<header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
				<div>
					<h1 className="text-2xl sm:text-3xl font-bold text-primary-dark">
						Dashboard Absensi
					</h1>
					<p className="text-gray-500">
						Selamat Datang, {user?.namaLengkap || "Pengguna"}!
					</p>
				</div>
				<div className="flex items-center gap-2 sm:gap-4">
					{user?.role === "admin" && (
						<Button asChild size="sm" className="text-xs sm:text-sm">
							<Link to="/admin/absensi">
								<ShieldCheck className="w-4 h-4 mr-2" />
								Admin Panel
							</Link>
						</Button>
					)}
					<Button
						variant="outline"
						size="sm"
						onClick={handleLogout}
						className="text-xs sm:text-sm"
					>
						<LogOut className="w-4 h-4 mr-2" />
						Logout
					</Button>
				</div>
			</header>
			<main>
				<Card className="w-full max-w-2xl mx-auto shadow-lg rounded-2xl">
					<CardHeader>
						<CardTitle className="text-xl sm:text-2xl">
							Rekam Kehadiran
						</CardTitle>
						<CardDescription>
							Pastikan Anda berada di lokasi klinik untuk melakukan absensi.
						</CardDescription>
					</CardHeader>
					<CardContent>{renderAbsenContent()}</CardContent>
				</Card>
			</main>
		</div>
	);
}
