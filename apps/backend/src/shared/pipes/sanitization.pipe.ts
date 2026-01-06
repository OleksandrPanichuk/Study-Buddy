import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { SanitizationUtil } from "@/shared/utils";

@Injectable()
export class SanitizationPipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata) {
    if (value === null || value === undefined) {
      return value;
    }

    if (typeof value === "string") {
      return SanitizationUtil.sanitizeInput(value);
    }

    if (Array.isArray(value)) {
      return SanitizationUtil.sanitizeArray<unknown>(value);
    }

    if (typeof value === "object") {
      return SanitizationUtil.sanitizeObject(value as Record<string, unknown>);
    }

    return value;
  }
}
