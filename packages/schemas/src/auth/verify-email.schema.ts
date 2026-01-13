import { z } from "zod";

export const verifyEmailSchema = z.object({
	code: z.string().length(6, "Code must be 6 characters long")
});

export type TVerifyEmailInput = z.infer<typeof verifyEmailSchema>;
