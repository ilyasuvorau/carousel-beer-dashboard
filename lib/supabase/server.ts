import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
	const cookieStore = await cookies();
	// biome-ignore lint/style/noNonNullAssertion: always set in production
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
	// biome-ignore lint/style/noNonNullAssertion: always set in production
	const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
	return createServerClient(url, key, {
		cookies: {
			getAll() {
				return cookieStore.getAll();
			},
			setAll(cookiesToSet) {
				try {
					for (const { name, value, options } of cookiesToSet) {
						cookieStore.set(name, value, options);
					}
				} catch {
					// Server component — ignore
				}
			},
		},
	});
}
