import path from "node:path";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";
import { CHUNK_MAX_CHARS, CHUNK_OVERLAP } from "./files.constants";

@Injectable()
export class FileProcessingService {
	private readonly logger = new Logger(FileProcessingService.name);

	public async extractTextFromBuffer(buffer: Buffer, mimeType?: string, filename?: string): Promise<string> {
		const lowerMime = (mimeType || "").toLowerCase();
		const lowerName = (filename || "").toLowerCase();
		const ext = path.extname(lowerName);

		// PDF Processing
		if (lowerMime === "application/pdf" || ext === ".pdf") {
			try {
				const parser = new PDFParse({ data: buffer });
				const data = await parser.getText();
				return data.text;
			} catch (error) {
				this.logger.error(`PDF extraction failed: ${error}`);
				throw new BadRequestException("Failed to extract text from PDF file");
			}
		}

		// DOCX Processing
		if (
			lowerMime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
			lowerName.endsWith(".docx")
		) {
			try {
				const result = await mammoth.extractRawText({ buffer });
				return result?.value || "";
			} catch (error) {
				this.logger.error(`DOCX extraction failed: ${error}`);
				throw new BadRequestException("Failed to extract text from DOCX file");
			}
		}

		// Plain Text / Markdown
		if (lowerMime.startsWith("text/") || lowerName.endsWith(".txt") || lowerName.endsWith(".md")) {
			return buffer.toString("utf8");
		}

		throw new BadRequestException(`Unsupported file type: ${mimeType || ext}`);
	}

	public estimateTokenCount(text: string): number {
		return Math.max(1, Math.ceil(text.length / 4));
	}

	public recursiveChunkText(text: string, maxChars = CHUNK_MAX_CHARS, overlap = CHUNK_OVERLAP): string[] {
		const separators = ["\n\n", "\n", ". ", "? ", "! ", " ", ""];
		const pieces = this.recursiveSplit(text, maxChars, separators);
		const merged = this.mergePiecesIntoChunks(pieces, maxChars);
		return this.applyOverlap(merged, overlap, maxChars);
	}

	private recursiveSplit(text: string, maxChars: number, separators: string[]): string[] {
		if (text.length <= maxChars) return [text];

		if (separators.length === 0) {
			return this.charFallbackSplit(text, maxChars);
		}

		const [sep, ...restSeps] = separators;
		const parts = this.splitKeepSeparator(text, sep);

		const result: string[] = [];
		for (const part of parts) {
			if (part.length <= maxChars) {
				result.push(part);
			} else {
				result.push(...this.recursiveSplit(part, maxChars, restSeps));
			}
		}
		return result;
	}

	private splitKeepSeparator(text: string, sep: string): string[] {
		if (!sep) return [text];
		const raw = text.split(sep);
		const out: string[] = [];

		for (let i = 0; i < raw.length; i++) {
			const part = raw[i];
			if (i < raw.length - 1) out.push(part + sep);
			else if (part) out.push(part);
		}
		return out;
	}

	private charFallbackSplit(text: string, maxChars: number): string[] {
		const out: string[] = [];
		for (let i = 0; i < text.length; i += maxChars) {
			out.push(text.slice(i, i + maxChars));
		}
		return out;
	}

	private mergePiecesIntoChunks(pieces: string[], maxChars: number): string[] {
		const chunks: string[] = [];
		let current = "";

		for (const piece of pieces) {
			if (current.length === 0) {
				current = piece;
			} else if (current.length + piece.length <= maxChars) {
				current += piece;
			} else {
				chunks.push(current);
				current = piece;
			}
		}
		if (current) chunks.push(current);
		return chunks;
	}

	private applyOverlap(chunks: string[], overlap: number, maxChars: number): string[] {
		if (overlap <= 0) return chunks;
		const out: string[] = [];

		for (let i = 0; i < chunks.length; i++) {
			let chunk = chunks[i];
			if (i > 0) {
				const prev = chunks[i - 1];
				const tail = prev.slice(-overlap);

				if (tail.length + chunk.length > maxChars) {
					chunk = chunk.slice(0, maxChars - tail.length);
				}
				chunk = tail + chunk;
			}
			out.push(chunk);
		}
		return out;
	}
}
