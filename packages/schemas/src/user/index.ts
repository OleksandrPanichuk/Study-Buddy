import z from "zod";
import {fileSchema, type TFile, type TUser, userSchema} from "../models";

export const currentUserResponseSchema = userSchema
	.omit({ hash: true })
	.extend({
		avatar: fileSchema.nullish(),
	});

export type TCurrentUserResponse = z.infer<typeof currentUserResponseSchema>;

export type TUserWithAvatar = TUser & {
	avatar?: TFile;
};
