export const FILES_API_ROUTES = {
	uploadTutorChat: (tutorChatId: string) => `files/tutor-chat/${tutorChatId}/upload`,
	getContext: (tutorChatId: string) => `context-files/${tutorChatId}`,
	uploadContext: (tutorChatId: string) => `context-files/${tutorChatId}/upload`,
	updateContext: (contextFileId: string) => `context-files/${contextFileId}`,
	delete: (fileAssetId: string) => `files/${fileAssetId}`
} as const;
