import {z} from "zod";
import {zDate, zObjectId, zUsername} from "../utils";

export const userSchema = z.object({
	id: zObjectId,
	email: z.email(),
	emailVerified: z.boolean(),
	hash: z.string().nullish(),
	username: zUsername,
	failedLoginAttempts: z.number().nonnegative(),
	lockedUntil: zDate.nullish(),
	avatarId: zObjectId.nullish(),

	createdAt: zDate,
	updatedAt: zDate,
});
