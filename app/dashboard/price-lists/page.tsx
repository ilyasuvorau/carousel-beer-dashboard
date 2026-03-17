import { PriceListCard } from "@/components/price-lists/price-list-card";
import { UploadForm } from "@/components/price-lists/upload-form";
import { createClient } from "@/lib/supabase/server";
import type { PriceList } from "@/lib/types/price-list";

export const dynamic = "force-dynamic";

export default async function PriceListsPage() {
	const supabase = await createClient();
	const { data: priceLists } = await supabase
		.from("price_lists")
		.select("*")
		.order("created_at", { ascending: false });

	const lists = (priceLists ?? []) as PriceList[];

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold">Price Lists</h1>
				<p className="text-muted-foreground text-sm mt-1">
					Import and manage beer wholesale price lists.
				</p>
			</div>
			<UploadForm />
			{lists.length > 0 ? (
				<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
					{lists.map((pl) => (
						<PriceListCard key={pl.id} priceList={pl} />
					))}
				</div>
			) : (
				<p className="text-muted-foreground text-sm">
					No price lists yet. Import one above.
				</p>
			)}
		</div>
	);
}
