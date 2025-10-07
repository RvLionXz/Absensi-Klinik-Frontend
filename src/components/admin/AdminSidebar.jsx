import { AdminNavContent } from "./AdminNavContent";

export function AdminSidebar() {
	return (
		<div className="hidden border-r bg-white md:block w-64">
			<AdminNavContent />
		</div>
	);
}
