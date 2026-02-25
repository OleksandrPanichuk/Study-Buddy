export const FILES_API_ROUTES = {
	uploadTutorChat: (tutorChatId: string) => `files/tutor-chat/${tutorChatId}/upload`,
	delete: (fileAssetId: string) => `files/${fileAssetId}`
} as const;
