import { google } from "googleapis";

function getAuth() {
	const key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
	if (!key) throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY not set");
	const credentials = JSON.parse(key);
	return new google.auth.GoogleAuth({
		credentials,
		scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
	});
}

/** Extract spreadsheet ID from a Google Sheets URL */
export function extractSheetId(url: string): string {
	const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
	if (!match) throw new Error("Invalid Google Sheets URL");
	return match[1];
}

/** Fetch Google Sheet as tab-separated text (all sheets) */
export async function fetchGoogleSheet(url: string): Promise<string> {
	const spreadsheetId = extractSheetId(url);
	const auth = getAuth();
	const sheets = google.sheets({ version: "v4", auth });

	// Get spreadsheet metadata to find sheet names
	const { data: meta } = await sheets.spreadsheets.get({ spreadsheetId });
	const sheetNames = meta.sheets?.map((s) => s.properties?.title ?? "") ?? [];

	const lines: string[] = [];
	for (const sheetName of sheetNames) {
		const { data } = await sheets.spreadsheets.values.get({
			spreadsheetId,
			range: sheetName,
		});
		lines.push(`=== Sheet: ${sheetName} ===`);
		for (const row of data.values ?? []) {
			if (row.some((cell: string) => cell)) {
				lines.push(row.map((cell: string) => String(cell ?? "")).join("\t"));
			}
		}
	}
	return lines.join("\n");
}
