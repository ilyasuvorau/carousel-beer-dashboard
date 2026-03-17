import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
	// biome-ignore lint/style/noNonNullAssertion: always set in production
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
	// biome-ignore lint/style/noNonNullAssertion: always set in production
	const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
	return createBrowserClient(url, key);
}
