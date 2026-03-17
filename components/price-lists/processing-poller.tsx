"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function ProcessingPoller({ status }: { status: string }) {
	const router = useRouter();

	useEffect(() => {
		if (status !== "processing") return;
		const interval = setInterval(() => {
			router.refresh();
		}, 3000);
		return () => clearInterval(interval);
	}, [status, router]);

	return null;
}
