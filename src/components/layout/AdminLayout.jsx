import { Outlet, Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Menu } from "lucide-react";
import { AdminNavContent } from "@/components/admin/AdminNavContent";

export function AdminLayout() {
	return (
		<div className="grid w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
			<div className="hidden border-r bg-background md:block">
				<AdminNavContent />
			</div>

			<div className="flex flex-col">
				<header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:hidden">
					<Sheet>
						<SheetTrigger asChild>
							<Button variant="outline" size="icon" className="shrink-0">
								<Menu className="h-5 w-5" />
								<span className="sr-only">Toggle navigation menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="left" className="flex flex-col p-0">
							<AdminNavContent />
						</SheetContent>
					</Sheet>

					<div className="flex-1 text-center font-semibold text-lg text-primary-dark">
						Admin Panel
					</div>

					<Button asChild variant="ghost" size="icon">
						<Link to="/dashboard">
							<ArrowLeft className="h-5 w-5" />
							<span className="sr-only">Kembali ke Dashboard</span>
						</Link>
					</Button>
				</header>

				<main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-y-auto">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
