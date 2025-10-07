import { useState } from "react";
import apiClient from "@/api/apiClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export function AddUserForm({ setDialogOpen }) {
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		nama_lengkap: "",
		username: "",
		password: "",
		jabatan: "",
	});

	const handleChange = (e) => {
		const { id, value } = e.target;
		setFormData((prev) => ({ ...prev, [id]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			await apiClient.post("/users", formData);
			toast({
				title: "Sukses!",
				description: `Pegawai baru "${formData.nama_lengkap}" berhasil ditambahkan.`,
				className: "bg-green-500 text-white",
			});
			setDialogOpen(false);
		} catch (error) {
			toast({
				title: "Gagal Menambahkan Pegawai",
				description:
					error.response?.data?.message || "Terjadi kesalahan pada server.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="grid gap-4 py-4">
			<div className="grid grid-cols-4 items-center gap-4">
				<Label htmlFor="nama_lengkap" className="text-right">
					Nama Lengkap
				</Label>
				<Input
					id="nama_lengkap"
					value={formData.nama_lengkap}
					onChange={handleChange}
					className="col-span-3"
					required
				/>
			</div>
			<div className="grid grid-cols-4 items-center gap-4">
				<Label htmlFor="username" className="text-right">
					Username
				</Label>
				<Input
					id="username"
					value={formData.username}
					onChange={handleChange}
					className="col-span-3"
					required
				/>
			</div>
			<div className="grid grid-cols-4 items-center gap-4">
				<Label htmlFor="password" className="text-right">
					Password
				</Label>
				<Input
					id="password"
					type="password"
					value={formData.password}
					onChange={handleChange}
					className="col-span-3"
					required
				/>
			</div>
			<div className="grid grid-cols-4 items-center gap-4">
				<Label htmlFor="jabatan" className="text-right">
					Jabatan
				</Label>
				<Input
					id="jabatan"
					value={formData.jabatan}
					onChange={handleChange}
					className="col-span-3"
				/>
			</div>
			<div className="flex justify-end mt-4">
				<Button type="submit" disabled={isLoading}>
					{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					Simpan Pegawai
				</Button>
			</div>
		</form>
	);
}
