import {z} from "zod";

export const deleteTutorChatInputSchema = z.object({
	tutorChatId: z.uuidv4("Invalid Id"),
});

export type TDeleteTutorChatInput = z.infer<typeof deleteTutorChatInputSchema>;

export const bulkDeleteTutorChatsInputSchema = z.object({
	ids: z.array(z.uuidv4("Invalid Id")),
});

export type TBulkDeleteTutorChatsInput = z.infer<
	typeof bulkDeleteTutorChatsInputSchema
>;
