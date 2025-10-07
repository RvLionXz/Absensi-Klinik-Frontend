import { useState, useEffect } from "react";
import apiClient from "@/api/apiClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Loader2, User, MapPin, Clock, CalendarIcon } from "lucide-react";
import { format } from "date-fns";

export function AdminAbsensiPage() {
	const [absensiData, setAbsensiData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [filter, setFilter] = useState("today");
	const [selectedDate, setSelectedDate] = useState(new Date());

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				const timezoneOffset = new Date().getTimezoneOffset();
				const params = { filter, tzOffset: timezoneOffset };
				if (filter === "date") {
					if (!selectedDate) {
						setAbsensiData([]);
						setIsLoading(false);
						return;
					}
					params.date = format(selectedDate, "yyyy-MM-dd");
				}

				const response = await apiClient.get("/absensi", { params });
				setAbsensiData(Array.isArray(response.data) ? response.data : []);
			} catch (error) {
				console.error("Gagal mengambil data absensi:", error);
				setAbsensiData([]);
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, [filter, selectedDate]);

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

	return (
		<Card className="shadow-lg rounded-2xl">
			<CardHeader>
				<div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
					<CardTitle className="text-xl sm:text-2xl">
						Riwayat Absensi Karyawan
					</CardTitle>
					<div className="flex items-center gap-2">
						<Select value={filter} onValueChange={setFilter}>
							<SelectTrigger className="w-full sm:w-[180px]">
								<SelectValue placeholder="Pilih Filter" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="today">Hari Ini</SelectItem>
								<SelectItem value="week">Minggu Ini</SelectItem>
								<SelectItem value="month">Bulan Ini</SelectItem>
								<SelectItem value="date">Per Tanggal</SelectItem>
								<SelectItem value="all">Semua</SelectItem>
							</SelectContent>
						</Select>
						{filter === "date" && (
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant={"outline"}
										className="w-full sm:w-[280px] justify-start text-left font-normal"
									>
										<CalendarIcon className="mr-2 h-4 w-4" />
										{selectedDate ? (
											format(selectedDate, "PPP")
										) : (
											<span>Pilih tanggal</span>
										)}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0">
									<Calendar
										mode="single"
										selected={selectedDate}
										onSelect={(date) => {
											if (date) setSelectedDate(date);
										}}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
						)}
					</div>
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
										<TableHead className="font-bold">Nama Lengkap</TableHead>
										<TableHead className="font-bold">Jabatan</TableHead>
										<TableHead className="font-bold">Waktu Absen</TableHead>
										<TableHead className="font-bold text-right">
											Lokasi (Lat, Long)
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{absensiData.length > 0 ? (
										absensiData.map((absen) => (
											<TableRow key={absen.id}>
												<TableCell>{absen.nama_lengkap}</TableCell>
												<TableCell>{absen.jabatan}</TableCell>
												<TableCell>{formatDate(absen.waktu_absen)}</TableCell>
												<TableCell className="text-right">{`${parseFloat(
													absen.latitude
												).toFixed(4)}, ${parseFloat(absen.longitude).toFixed(
													4
												)}`}</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell colSpan="4" className="text-center h-24">
												Tidak ada data absensi untuk periode ini.
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>
						<div className="block md:hidden space-y-4">
							{absensiData.length > 0 ? (
								absensiData.map((absen) => (
									<Card key={absen.id} className="p-4">
										<div className="flex flex-col space-y-2">
											<div className="flex items-center gap-2 font-bold text-primary-dark">
												<User className="w-4 h-4" />
												<span>{absen.nama_lengkap}</span>
											</div>
											<div className="text-sm text-gray-500">
												{absen.jabatan}
											</div>
											<div className="border-t my-2"></div>
											<div className="flex justify-between items-center text-sm">
												<div className="flex items-center gap-2 text-gray-600">
													<Clock className="w-4 h-4" />
													<span>Waktu</span>
												</div>
												<span className="font-medium">
													{formatDate(absen.waktu_absen)}
												</span>
											</div>
											<div className="flex justify-between items-center text-sm">
												<div className="flex items-center gap-2 text-gray-600">
													<MapPin className="w-4 h-4" />
													<span>Lokasi</span>
												</div>
												<span className="font-mono text-xs">{`${parseFloat(
													absen.latitude
												).toFixed(4)}, ${parseFloat(absen.longitude).toFixed(
													4
												)}`}</span>
											</div>
										</div>
									</Card>
								))
							) : (
								<div className="text-center h-24 flex items-center justify-center text-gray-500">
									Tidak ada data absensi untuk periode ini.
								</div>
							)}
						</div>
					</>
				)}
			</CardContent>
		</Card>
	);
}
