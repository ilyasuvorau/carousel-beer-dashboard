"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function UploadForm() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleFileUpload(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			const formData = new FormData(e.currentTarget);
			const res = await fetch("/api/extract/upload", {
				method: "POST",
				body: formData,
			});
			const json = await res.json();
			if (!res.ok) throw new Error(json.error ?? "Upload failed");
			router.push(`/dashboard/price-lists/${json.priceListId}`);
			router.refresh();
		} catch (err) {
			setError(String(err));
		} finally {
			setLoading(false);
		}
	}

	async function handleGoogleUrl(
		e: React.FormEvent<HTMLFormElement>,
		type: "doc" | "sheet",
	) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			const form = e.currentTarget;
			const url = (form.elements.namedItem("url") as HTMLInputElement).value;
			const name = (form.elements.namedItem("name") as HTMLInputElement)?.value;
			const endpoint =
				type === "doc"
					? "/api/extract/google-doc"
					: "/api/extract/google-sheet";
			const res = await fetch(endpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ url, name }),
			});
			const json = await res.json();
			if (!res.ok) throw new Error(json.error ?? "Extraction failed");
			router.push(`/dashboard/price-lists/${json.priceListId}`);
			router.refresh();
		} catch (err) {
			setError(String(err));
		} finally {
			setLoading(false);
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Import Price List</CardTitle>
			</CardHeader>
			<CardContent>
				<Tabs defaultValue="file">
					<TabsList className="mb-4">
						<TabsTrigger value="file">Upload File</TabsTrigger>
						<TabsTrigger value="google-doc">Google Doc</TabsTrigger>
						<TabsTrigger value="google-sheet">Google Sheet</TabsTrigger>
					</TabsList>

					<TabsContent value="file">
						<form onSubmit={handleFileUpload} className="space-y-4">
							<div className="space-y-1">
								<Label htmlFor="name-file">Name (optional)</Label>
								<Input
									id="name-file"
									name="name"
									placeholder="e.g. STAMM BREWING — March 2026"
								/>
							</div>
							<div className="space-y-1">
								<Label htmlFor="file">File (PDF, DOCX, XLSX)</Label>
								<Input
									id="file"
									name="file"
									type="file"
									accept=".pdf,.docx,.xlsx"
									required
								/>
							</div>
							{error && <p className="text-destructive text-sm">{error}</p>}
							<Button type="submit" disabled={loading}>
								{loading ? "Processing..." : "Upload & Extract"}
							</Button>
						</form>
					</TabsContent>

					<TabsContent value="google-doc">
						<form
							onSubmit={(e) => handleGoogleUrl(e, "doc")}
							className="space-y-4"
						>
							<div className="space-y-1">
								<Label htmlFor="name-doc">Name (optional)</Label>
								<Input
									id="name-doc"
									name="name"
									placeholder="e.g. STAMM BREWING — March 2026"
								/>
							</div>
							<div className="space-y-1">
								<Label htmlFor="url-doc">Google Doc URL</Label>
								<Input
									id="url-doc"
									name="url"
									type="url"
									placeholder="https://docs.google.com/document/d/..."
									required
								/>
							</div>
							{error && <p className="text-destructive text-sm">{error}</p>}
							<Button type="submit" disabled={loading}>
								{loading ? "Processing..." : "Extract from Doc"}
							</Button>
						</form>
					</TabsContent>

					<TabsContent value="google-sheet">
						<form
							onSubmit={(e) => handleGoogleUrl(e, "sheet")}
							className="space-y-4"
						>
							<div className="space-y-1">
								<Label htmlFor="name-sheet">Name (optional)</Label>
								<Input
									id="name-sheet"
									name="name"
									placeholder="e.g. Black Cat Brewery — March 2026"
								/>
							</div>
							<div className="space-y-1">
								<Label htmlFor="url-sheet">Google Sheets URL</Label>
								<Input
									id="url-sheet"
									name="url"
									type="url"
									placeholder="https://docs.google.com/spreadsheets/d/..."
									required
								/>
							</div>
							{error && <p className="text-destructive text-sm">{error}</p>}
							<Button type="submit" disabled={loading}>
								{loading ? "Processing..." : "Extract from Sheet"}
							</Button>
						</form>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
}
