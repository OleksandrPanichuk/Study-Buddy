import path from "node:path";

// biome-ignore lint/suspicious/noControlCharactersInRegex: We need to remove control characters from filenames
const CONTROL_CHARS_RE = /[\u0000-\u001F\u007F]/g;
const FORBIDDEN_FS_CHARS_RE = /[<>:"/\\|?*]/g;
const TRAILING_DOTS_SPACES_RE = /[. ]+$/g;
const WHITESPACE_RE = /\s+/g;
const MOJIBAKE_HINT_RE = /(?:\u00C3.|\u00D0.|\u00D1.|\u00D0|\u00D1)/;
const CYRILLIC_RE = /[\u0400-\u04FF]/;
const MAX_FILENAME_LENGTH = 180;

export function decodeLikelyMojibake(input: string): string {
	if (!input) return "file";

	const repaired = Buffer.from(input, "latin1").toString("utf8");

	if (repaired.includes("\uFFFD")) return input;
	if (repaired === input) return input;
	if (MOJIBAKE_HINT_RE.test(input) && CYRILLIC_RE.test(repaired)) return repaired;

	return input;
}

export function normalizeFilename(input: string): string {
	const decoded = decodeLikelyMojibake(input).normalize("NFC").trim();

	const ext = path.extname(decoded);
	const baseRow = decoded.slice(0, decoded.length - ext.length) || "file";

	const safeBase = baseRow
		.replace(CONTROL_CHARS_RE, "")
		.replace(FORBIDDEN_FS_CHARS_RE, "_")
		.replace(WHITESPACE_RE, " ")
		.replace(TRAILING_DOTS_SPACES_RE, "")
		.trim();

	const safeExt = ext.replace(CONTROL_CHARS_RE, "").replace(FORBIDDEN_FS_CHARS_RE, "").toLowerCase();

	const fallbackBase = safeBase || "file";

	return limitFilenameLength(`${fallbackBase}${safeExt}`, MAX_FILENAME_LENGTH);
}

export function buildContentDisposition(
	filename: string,
	dispositionType: "inline" | "attachment" = "attachment"
): string {
	const safeName = normalizeFilename(filename);
	const fallbackAscii = sanitizeFilenameForAsciiHeader(safeName);
	const encoded = encodeRFC5987(safeName);

	return `${dispositionType}; filename="${fallbackAscii}"; filename*=UTF-8''${encoded}`;
}

function sanitizeFilenameForAsciiHeader(name: string): string {
	return (
		name
			.replace(/[^\x20-\x7E]/g, "_")
			.replace(/["\\]/g, "_")
			.replace(WHITESPACE_RE, " ")
			.trim() || "file"
	);
}

function encodeRFC5987(value: string): string {
	return encodeURIComponent(value)
		.replace(/['()]/g, (ch) => `%${ch.charCodeAt(0).toString(16).toUpperCase()}`)
		.replace(/\*/g, "%2A");
}

function limitFilenameLength(value: string, maxLength: number): string {
	if (value.length <= maxLength) return value;

	const ext = path.extname(value);
	const base = value.slice(0, value.length - ext.length);
	const allowedBaseLen = Math.max(1, maxLength - ext.length);

	return `${base.slice(0, allowedBaseLen)}${ext}`;
}
