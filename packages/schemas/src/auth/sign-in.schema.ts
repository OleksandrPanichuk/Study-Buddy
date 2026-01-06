import {z} from "zod";
import {userSchema} from "../models";
import {zPassword} from "../utils";

export const signInInputSchema = z.object({
	email: z.email("Invalid email address").trim(),
	password: zPassword,
});

export const signInResponseSchema = userSchema.omit({ hash: true });
