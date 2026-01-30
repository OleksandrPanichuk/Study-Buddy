import {z} from "zod";
import {zDate, zUsername} from "../utils";

export const userSchema = z.object({
	id: z.uuidv4(),
	email: z.email(),
	emailVerified: z.boolean(),
	hash: z.string().nullish(),
	username: zUsername,
	failedLoginAttempts: z.number().nonnegative(),
	lockedUntil: zDate.nullish(),
	avatarId: z.uuidv4().nullish(),

	createdAt: zDate,
	updatedAt: zDate,
});

export type TUser = z.infer<typeof userSchema>;
