export interface IUploadResult {
	key: string;
	url: string;
	bucket: string;
	size: number;
	mimeType: string;
	etag?: string;
	name: string;
}

export interface IPresignedUploadUrlResult {
	uploadUrl: string;
	key: string;
	publicUrl: string;
	bucket: string;
	expiresIn: number;
}

export interface IUploadOptions {
	folder?: string;
	filename?: string;
	contentType?: string;
	acl?: "private" | "public-read" | "public-read-write" | "authenticated-read";
	metadata?: Record<string, string>;
	maxSize?: number;
	allowedMimeTypes?: string[];
	cacheControl?: string;
}

export interface IFileValidationOptions {
	maxSize?: number;
	allowedMimeTypes?: string[];
	allowedExtensions?: string[];
}

export interface IDeleteResult {
	key: string;
	success: boolean;
	error?: string;
}
