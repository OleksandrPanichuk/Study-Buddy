import z from "zod";

export const zPathname = z.string().regex(/^\/([a-z0-9\-_]+\/?)*$/);
