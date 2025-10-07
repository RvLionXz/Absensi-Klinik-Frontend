import { NavLink, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
	ShieldCheck,
	Users,
	CalendarClock,
	LogOut,
	ArrowLeft,
} from "lucide-react";

export function AdminNavContent() {
	const { logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	const navLinkClass = ({ isActive }) =>
		`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-primary ${
			isActive ? "bg-primary/10 text-primary font-semibold" : ""
		}`;

	return (
		<div className="flex h-full max-h-screen flex-col gap-2">
			<div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
				<Link
					to="/admin/absensi"
					className="flex items-center gap-2 font-semibold"
				>
					<ShieldCheck className="h-6 w-6 text-primary" />
					<span>Admin Panel</span>
				</Link>
			</div>
			<div className="flex-1">
				<nav className="grid items-start px-2 text-sm font-medium lg:px-4">
					<NavLink to="/admin/absensi" className={navLinkClass}>
						<CalendarClock className="h-4 w-4" />
						Data Absensi
					</NavLink>
					<NavLink to="/admin/users" className={navLinkClass}>
						<Users className="h-4 w-4" />
						Data Pengguna
					</NavLink>
				</nav>
			</div>
			<div className="mt-auto p-4 border-t">
				<Button asChild variant="outline" className="w-full justify-start mb-2">
					<Link to="/dashboard">
						<ArrowLeft className="w-4 h-4 mr-2" />
						Kembali ke Dashboard
					</Link>
				</Button>
				<Button
					variant="destructive"
					className="w-full justify-start"
					onClick={handleLogout}
				>
					<LogOut className="h-4 w-4 mr-2" />
					Logout
				</Button>
			</div>
		</div>
	);
}
