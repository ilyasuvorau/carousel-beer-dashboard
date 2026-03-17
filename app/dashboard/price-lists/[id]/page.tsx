import { notFound } from "next/navigation";
import { ExtractionStatus } from "@/components/price-lists/extraction-status";
import { PriceTable } from "@/components/price-lists/price-table";
import { ProcessingPoller } from "@/components/price-lists/processing-poller";
import { createClient } from "@/lib/supabase/server";
import type { PriceItem, PriceList } from "@/lib/types/price-list";

export const dynamic = "force-dynamic";

export default async function PriceListDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const supabase = await createClient();

	const { data: priceList } = await supabase
		.from("price_lists")
		.select("*")
		.eq("id", id)
		.single();
	if (!priceList) notFound();

	const { data: items } = await supabase
		.from("price_items")
		.select("*")
		.eq("price_list_id", id)
		.order("category", { ascending: true })
		.order("product_name", { ascending: true });

	return (
		<div className="space-y-4">
			<ProcessingPoller status={(priceList as PriceList).status} />
			<div className="flex items-center gap-3">
				<h1 className="text-2xl font-semibold">{priceList.name}</h1>
				<ExtractionStatus status={(priceList as PriceList).status} />
			</div>
			<div className="text-sm text-muted-foreground">
				Type: {priceList.source_type}
				{priceList.extracted_at &&
					` · Extracted: ${new Date(priceList.extracted_at).toLocaleDateString()}`}
				{priceList.source_url && (
					<>
						{" "}
						·{" "}
						<a
							href={priceList.source_url}
							target="_blank"
							rel="noopener noreferrer"
							className="underline"
						>
							Source
						</a>
					</>
				)}
			</div>
			{priceList.error_message && (
				<div className="text-destructive text-sm bg-destructive/10 p-3 rounded">
					{priceList.error_message}
				</div>
			)}
			<PriceTable items={(items ?? []) as PriceItem[]} />
		</div>
	);
}
