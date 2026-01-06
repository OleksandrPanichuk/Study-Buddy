import { Injectable } from "@nestjs/common";
import { PrismaService } from "@app/prisma";
import type { ICreateVerificationCodeData } from "@/auth/email-verification/interfaces";

@Injectable()
export class VerificationCodeRepository {
  constructor(private readonly db: PrismaService) {}

  public findByUserId(userId: string) {
    return this.db.verificationCode.findFirst({
      where: {
        userId,
        expiresAt: { gt: new Date() },
      },
    });
  }

  public findAllByUserId(userId: string) {
    return this.db.verificationCode.findMany({
      where: { userId, expiresAt: { gt: new Date() } },
    });
  }

  public create(data: ICreateVerificationCodeData) {
    return this.db.verificationCode.create({
      data: {
        code: data.code,
        userId: data.userId,
        expiresAt: data.expiresAt,
        resendCount: data.resendCount,
      },
    });
  }

  public async update(
    userId: string,
    data: Partial<Omit<ICreateVerificationCodeData, "userId">>,
  ) {
    return this.db.verificationCode.updateMany({
      where: {
        userId,
      },
      data: {
        code: data.code,
        resendCount: data.resendCount,
        expiresAt: data.expiresAt,
      },
    });
  }

  public async deleteExpired() {
    return this.db.verificationCode.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }

  public async deleteByUserId(userId: string) {
    return this.db.verificationCode.deleteMany({
      where: {
        userId,
      },
    });
  }
}
