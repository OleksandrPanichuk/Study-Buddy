import z from "zod";

export const deleteFileAssetInputSchema = z.object({
	fileAssetId: z.uuidv4("Invalid ID")
});

export type TDeleteFileAssetInput = z.infer<typeof deleteFileAssetInputSchema>;
