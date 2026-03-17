import { z } from "zod";

// ─── Zod schemas ─────────────────────────────────────────────────────────────

export const PriceListSchema = z.object({
	id: z.string().uuid(),
	name: z.string(),
	source_type: z.enum(["pdf", "docx", "xlsx", "google_doc", "google_sheet"]),
	source_url: z.string().nullable(),
	storage_path: z.string().nullable(),
	status: z.enum(["pending", "processing", "done", "error"]),
	error_message: z.string().nullable(),
	extracted_at: z.string().nullable(),
	created_at: z.string(),
});

export const PriceItemSchema = z.object({
	id: z.string().uuid(),
	price_list_id: z.string().uuid(),
	product_name: z.string(),
	style: z.string().nullable(),
	description: z.string().nullable(),
	abv: z.number().nullable(),
	ibu: z.number().nullable(),
	category: z.string().nullable(),
	price_case: z.number().nullable(),
	price_keg: z.number().nullable(),
	pack_size: z.string().nullable(),
	currency: z.string().default("RUB"),
	availability: z
		.enum(["in_stock", "limited", "out_of_stock", "coming_soon"])
		.nullable(),
	image_url: z.string().nullable(),
	bottling_date: z.string().nullable(),
	notes: z.string().nullable(),
	created_at: z.string(),
});

/** Schema for validating LLM-extracted items (id/price_list_id/created_at omitted, all nullish except product_name). */
export const ExtractedItemSchema = z.object({
	product_name: z.string(),
	style: z.string().nullish(),
	description: z.string().nullish(),
	abv: z.number().nullish(),
	ibu: z.number().nullish(),
	category: z.string().nullish(),
	price_case: z.number().nullish(),
	price_keg: z.number().nullish(),
	pack_size: z.string().nullish(),
	currency: z.string().nullish(),
	availability: z
		.enum(["in_stock", "limited", "out_of_stock", "coming_soon"])
		.nullish(),
	image_url: z.string().nullish(),
	bottling_date: z.string().nullish(),
	notes: z.string().nullish(),
});

// ─── TypeScript types ─────────────────────────────────────────────────────────

export type PriceList = z.infer<typeof PriceListSchema>;
export type PriceItem = z.infer<typeof PriceItemSchema>;
export type ExtractedItem = z.infer<typeof ExtractedItemSchema>;
