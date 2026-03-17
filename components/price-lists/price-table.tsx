import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { PriceItem } from "@/lib/types/price-list";

const availabilityConfig: Record<
	string,
	{
		label: string;
		variant: "default" | "secondary" | "destructive" | "outline";
	}
> = {
	in_stock: { label: "In Stock", variant: "default" },
	limited: { label: "Limited", variant: "outline" },
	out_of_stock: { label: "Out of Stock", variant: "destructive" },
	coming_soon: { label: "Coming Soon", variant: "secondary" },
};

export function PriceTable({ items }: { items: PriceItem[] }) {
	if (items.length === 0) {
		return <p className="text-muted-foreground text-sm">No items found.</p>;
	}

	return (
		<div className="overflow-auto">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Product</TableHead>
						<TableHead>Style</TableHead>
						<TableHead>ABV</TableHead>
						<TableHead>IBU</TableHead>
						<TableHead>Case Price</TableHead>
						<TableHead>Keg Price</TableHead>
						<TableHead>Pack</TableHead>
						<TableHead>Availability</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{items.map((item) => (
						<TableRow key={item.id}>
							<TableCell className="font-medium">
								<div>{item.product_name}</div>
								{item.category && (
									<div className="text-xs text-muted-foreground">
										{item.category}
									</div>
								)}
							</TableCell>
							<TableCell>{item.style ?? "—"}</TableCell>
							<TableCell>{item.abv != null ? `${item.abv}%` : "—"}</TableCell>
							<TableCell>{item.ibu ?? "—"}</TableCell>
							<TableCell>
								{item.price_case != null
									? `${item.price_case} ${item.currency}`
									: "—"}
							</TableCell>
							<TableCell>
								{item.price_keg != null
									? `${item.price_keg} ${item.currency}`
									: "—"}
							</TableCell>
							<TableCell>{item.pack_size ?? "—"}</TableCell>
							<TableCell>
								{item.availability
									? (() => {
											const cfg = availabilityConfig[item.availability];
											return cfg ? (
												<Badge variant={cfg.variant}>{cfg.label}</Badge>
											) : null;
										})()
									: "—"}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
