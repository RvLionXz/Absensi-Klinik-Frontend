import { LoginForm } from "@/components/auth/LoginForm";
import { ClinicIllustration } from "@/components/auth/ClinicIllustration";

export function LoginPage() {
	return (
		<div className="w-full min-h-screen flex lg:grid lg:grid-cols-2">
			<div className="hidden bg-gradient-to-br from-primary to-primary-dark lg:flex flex-col items-center justify-center p-8 relative overflow-hidden">
				<div className="absolute inset-0 opacity-10">
					<ClinicIllustration className="absolute -top-20 -left-20 w-96 h-96 text-primary-dark" />
					<ClinicIllustration className="absolute -bottom-24 -right-16 w-80 h-80 text-primary-dark transform rotate-180" />
				</div>
				<div className="z-10 text-center space-y-8">
					<div className="flex justify-center">
						<ClinicIllustration className="w-[450px] h-[450px] animate-float drop-shadow-2xl" />
					</div>
					<div className="space-y-2">
						<h1 className="text-5xl font-bold text-white tracking-wider drop-shadow-lg">
							ABSENSI KLINIK
						</h1>
						<p className="text-white/80 text-lg">
							Sistem Masih Dalam Tahap Pengembangan
						</p>
					</div>
				</div>
			</div>

			<div className="flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12 lg:bg-gradient-to-br lg:from-slate-50 lg:to-slate-200">
				<div className="lg:hidden text-center mb-10 w-full">
					<h1 className="text-3xl font-bold text-primary">Absensi Klinik</h1>
					<p className="text-gray-500">Sistem Masih Dalam Tahap Pengembangan</p>
				</div>
				<LoginForm />
			</div>
		</div>
	);
}
