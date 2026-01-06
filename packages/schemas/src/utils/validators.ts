import {z} from "zod";

export const zPassword = z
	.string()
	.min(8, "Password must be at least 8 characters long")
	.max(32, "Password cannot exceed 32 characters")
	.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
	.regex(/[a-z]/, "Password must contain at least one lowercase letter")
	.regex(/[0-9]/, "Password must contain at least one number")
	.regex(
		/[!@#$%^&*()_+={}\[\]:;"'<>,.?\/\\-]/,
		"Password must contain at least one special character",
	);

export const zObjectId = z
	.string()
	.regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format");

export const zUsername = z
	.string()
	.trim()
	.min(3, "Username must be at least 3 characters long");

export const zDate = z.preprocess((val) => {
	if (val instanceof Date) return val.toISOString();
	return val;
}, z.iso.datetime()) as z.ZodType<Date | string>;
