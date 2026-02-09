import path from "node:path";
import { BadRequestException } from "@nestjs/common";
import { ALLOWED_FILE_TYPES } from "./files.constants";

export function fileFilter(_: Request, file: Express.Multer.File, cb: (error: Error, acceptFile: boolean) => void) {
	const ext = path.extname(file.originalname || "").toLowerCase();

	if (!ALLOWED_FILE_TYPES.includes(ext)) {
		return cb(
			new BadRequestException(
				`File type ${ext} is not allowed. Allowed types are: ${ALLOWED_FILE_TYPES.join(",").replace(".", "")}`
			),
			false
		);
	}

	cb(null, true);
}
