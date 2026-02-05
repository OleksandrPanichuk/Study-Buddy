export interface IUploadResult {
	key: string;
	url: string;
	bucket: string;
	size: number;
	mimetype: string;
	etag?: string;
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

export interface IFileExistsResult {
	exists: boolean;
	size?: number;
	lastModified?: Date;
	contentType?: string;
}
