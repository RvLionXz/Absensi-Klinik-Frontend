import { useState } from "react";
import apiClient from "@/api/apiClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export function ResetPasswordForm({ user, setDialogOpen }) {
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);
	const [newPassword, setNewPassword] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			await apiClient.put(`/users/reset-password/${user.id}`, { newPassword });
			toast({
				title: "Sukses!",
				description: `Password untuk ${user.nama_lengkap} berhasil di-reset.`,
				className: "bg-green-500 text-white",
			});
			setDialogOpen(false);
		} catch (error) {
			toast({
				title: "Gagal Reset Password",
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
				<Label htmlFor="newPassword" className="text-right">
					Password Baru
				</Label>
				<Input
					id="newPassword"
					type="text"
					value={newPassword}
					onChange={(e) => setNewPassword(e.target.value)}
					className="col-span-3"
					required
					minLength={6}
				/>
			</div>
			<div className="flex justify-end mt-4">
				<Button type="submit" disabled={isLoading}>
					{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					Simpan Password Baru
				</Button>
			</div>
		</form>
	);
}
