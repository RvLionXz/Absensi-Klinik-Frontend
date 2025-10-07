import { useState, useEffect } from "react";
import apiClient from "@/api/apiClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Loader2,
	RefreshCw,
	KeyRound,
	MoreHorizontal,
	UserPlus,
	Smartphone,
} from "lucide-react";
import { AddUserForm } from "@/components/admin/AddUserForm";
import { ResetPasswordForm } from "@/components/admin/ResetPasswordForm";

export function AdminUsersPage() {
	const { toast } = useToast();
	const [users, setUsers] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isAddUserOpen, setIsAddUserOpen] = useState(false);
	const [resetPasswordUser, setResetPasswordUser] = useState(null);

	const fetchUsers = async () => {
		setIsLoading(true);
		try {
			const response = await apiClient.get("/users");

			// =================================================================
			// INI ADALAH BARIS DEBUGGING PALING PENTING
			// =================================================================
			console.log("DATA MENTAH DARI BACKEND (response.data):", response.data);
			// =================================================================

			setUsers(Array.isArray(response.data) ? response.data : []);
		} catch (error) {
			console.error("Gagal mengambil data pengguna:", error);
			setUsers([]);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (!isAddUserOpen) {
			fetchUsers();
		}
	}, [isAddUserOpen]);

	const handleResetDevice = async (userId, userName) => {
		try {
			await apiClient.put(`/users/reset-device/${userId}`);
			toast({
				title: "Sukses!",
				description: `Device ID untuk ${userName} berhasil di-reset.`,
				className: "bg-green-500 text-white",
			});
			fetchUsers();
		} catch (error) {
			toast({
				title: "Gagal Reset Device",
				description: "Terjadi kesalahan pada server.",
				variant: "destructive",
			});
		}
	};

	const UserActions = ({ user }) => (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="h-8 w-8 p-0">
					<span className="sr-only">Buka menu</span>
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>Aksi</DropdownMenuLabel>
				<DropdownMenuItem onSelect={() => setResetPasswordUser(user)}>
					<KeyRound className="w-4 h-4 mr-2" />
					<span>Reset Password</span>
				</DropdownMenuItem>
				{user.device_id && (
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-destructive">
								<RefreshCw className="w-4 h-4 mr-2" />
								<span>Reset Device</span>
							</div>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									Reset Device untuk {user.nama_lengkap}?
								</AlertDialogTitle>
								<AlertDialogDescription>
									Pengguna akan bisa login dari perangkat baru pada sesi
									berikutnya.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Batal</AlertDialogCancel>
								<AlertDialogAction
									onClick={() => handleResetDevice(user.id, user.nama_lengkap)}
								>
									Ya, Reset Device
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);

	return (
		<>
			<Card className="shadow-lg rounded-2xl">
				<CardHeader>
					<div className="flex justify-between items-center">
						<div>
							<CardTitle className="text-xl sm:text-2xl">
								Manajemen Data Pengguna
							</CardTitle>
							<CardDescription>
								Tambah, lihat, dan kelola data pegawai.
							</CardDescription>
						</div>
						<Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
							<DialogTrigger asChild>
								<Button>
									<UserPlus className="w-4 h-4 mr-2" />
									Tambah Pegawai
								</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-[425px]">
								<DialogHeader>
									<DialogTitle>Tambah Data Pegawai Baru</DialogTitle>
									<DialogDescription>
										Isi detail di bawah ini untuk membuat akun pegawai baru.
									</DialogDescription>
								</DialogHeader>
								<AddUserForm setDialogOpen={setIsAddUserOpen} />
							</DialogContent>
						</Dialog>
					</div>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="flex justify-center items-center h-64">
							<Loader2 className="w-12 h-12 animate-spin text-primary" />
						</div>
					) : (
						<>
							<div className="hidden md:block border rounded-lg">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Nama Lengkap</TableHead>
											<TableHead>Username</TableHead>
											<TableHead>Role</TableHead>
											<TableHead>Device ID</TableHead>
											<TableHead className="text-right">Aksi</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{users.map((user) => (
											<TableRow key={user.id}>
												<TableCell className="font-medium">
													{user.nama_lengkap}
												</TableCell>
												<TableCell>{user.username}</TableCell>
												<TableCell>{user.role}</TableCell>
												<TableCell className="font-mono text-xs max-w-[150px] truncate">
													{user.device_id || "-"}
												</TableCell>
												<TableCell className="text-right">
													{user.role === "karyawan" && (
														<UserActions user={user} />
													)}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>

							<div className="block md:hidden space-y-4">
								{users.length > 0 ? (
									users.map((user) => (
										<Card key={user.id} className="p-4">
											<div className="flex justify-between items-start">
												<div className="space-y-1">
													<p className="font-bold text-primary-dark">
														{user.nama_lengkap}
													</p>
													<p className="text-sm text-gray-500">
														@{user.username} -{" "}
														<span className="capitalize font-medium">
															{user.role}
														</span>
													</p>
													<div className="flex items-center gap-2 pt-1 text-xs text-gray-600">
														<Smartphone className="w-3 h-3" />
														<span className="font-mono truncate">
															{user.device_id || "Belum terdaftar"}
														</span>
													</div>
												</div>
												{user.role === "karyawan" && (
													<UserActions user={user} />
												)}
											</div>
										</Card>
									))
								) : (
									<div className="text-center h-24 flex items-center justify-center text-gray-500">
										Tidak ada data pengguna.
									</div>
								)}
							</div>
						</>
					)}
				</CardContent>
			</Card>

			<Dialog
				open={!!resetPasswordUser}
				onOpenChange={() => setResetPasswordUser(null)}
			>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>
							Reset Password untuk {resetPasswordUser?.nama_lengkap}
						</DialogTitle>
						<DialogDescription>
							Masukkan password baru di bawah ini. Pengguna akan bisa login
							dengan password ini.
						</DialogDescription>
					</DialogHeader>
					{resetPasswordUser && (
						<ResetPasswordForm
							user={resetPasswordUser}
							setDialogOpen={() => setResetPasswordUser(null)}
						/>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
}
