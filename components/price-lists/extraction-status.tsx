"use client";

import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Status = "pending" | "processing" | "done" | "error";

const statusConfig: Record<
	Status,
	{
		label: string;
		variant: "default" | "secondary" | "destructive" | "outline";
	}
> = {
	pending: { label: "Pending", variant: "secondary" },
	processing: { label: "Processing...", variant: "outline" },
	done: { label: "Done", variant: "default" },
	error: { label: "Error", variant: "destructive" },
};

export function ExtractionStatus({ status }: { status: Status }) {
	const config = statusConfig[status] ?? statusConfig.pending;
	return (
		<Badge variant={config.variant} className="gap-1">
			{status === "processing" && <Loader2 className="h-3 w-3 animate-spin" />}
			{config.label}
		</Badge>
	);
}
