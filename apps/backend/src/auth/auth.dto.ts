import {
  signInInputSchema,
  signInResponseSchema,
  signUpInputSchema,
  signUpResponseSchema,
} from "@repo/schemas";
import { createZodDto } from "nestjs-zod";

export class SignInInput extends createZodDto(signInInputSchema) {}
export class SignInResponse extends createZodDto(signInResponseSchema) {}

export class SignUpInput extends createZodDto(signUpInputSchema) {}
export class SignUpResponse extends createZodDto(signUpResponseSchema) {}
