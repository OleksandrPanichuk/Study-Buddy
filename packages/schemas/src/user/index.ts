import { userSchema } from "../models";
import z from "zod";

export const currentUserResponseSchema = userSchema.omit({ hash: true });
export type TCurrentUserResponse = z.infer<typeof currentUserResponseSchema>;
