// lib/extractors/xlsx.ts
import * as XLSX from "xlsx";

export function parseXlsx(buffer: Buffer): string {
	const workbook = XLSX.read(buffer, { type: "buffer" });
	const lines: string[] = [];

	for (const sheetName of workbook.SheetNames) {
		const sheet = workbook.Sheets[sheetName];
		const rows = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1 });
		lines.push(`=== Sheet: ${sheetName} ===`);
		for (const row of rows) {
			if (
				row.some((cell) => cell !== null && cell !== undefined && cell !== "")
			) {
				lines.push(row.map((cell) => String(cell ?? "")).join("\t"));
			}
		}
	}

	return lines.join("\n");
}
