import {z} from "zod";
import {userSchema} from "../models";
import {zPassword, zUsername} from "../utils";

export const signUpInputSchema = z.object({
	email: z.email("Invalid email address").trim(),
	username: zUsername,
	password: zPassword,
});

export const signUpResponseSchema = userSchema.omit({ hash: true });

export type SignUpResponse = z.infer<typeof signUpResponseSchema>;
