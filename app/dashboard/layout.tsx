import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-screen">
			<aside className="w-56 border-r bg-neutral-50 dark:bg-neutral-900 flex flex-col p-4 gap-1 shrink-0">
				<div className="font-semibold text-sm mb-2 px-2">Beer Dashboard</div>
				<Separator className="mb-2" />
				<Link
					href="/dashboard/price-lists"
					className="px-2 py-1.5 rounded text-sm hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
				>
					Price Lists
				</Link>
			</aside>
			<main className="flex-1 p-6 overflow-auto">{children}</main>
		</div>
	);
}
