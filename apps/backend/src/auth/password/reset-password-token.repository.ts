import type { ICreateResetPasswordTokenData } from "@/auth/password/interfaces";
import { PrismaService } from "@app/prisma";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ResetPasswordTokenRepository {
  constructor(private readonly db: PrismaService) {}

  public findByToken(token: string) {
    return this.db.resetPasswordToken.findUnique({ where: { token } });
  }

  public findByUserId(userId: string) {
    return this.db.resetPasswordToken.findFirst({
      where: { userId, expiresAt: { gt: new Date() } },
    });
  }

  public create(data: ICreateResetPasswordTokenData) {
    return this.db.resetPasswordToken.create({
      data: {
        userId: data.userId,
        token: data.token,
        expiresAt: data.expiresAt,
        resendCount: data.resendCount ?? 0,
      },
    });
  }

  public incrementResendCount(id: string) {
    return this.db.resetPasswordToken.update({
      where: {
        id,
      },
      data: {
        resendCount: {
          increment: 1,
        },
      },
    });
  }

  public deleteByUserId(userId: string) {
    return this.db.resetPasswordToken.deleteMany({ where: { userId } });
  }

  public deleteExpired() {
    return this.db.resetPasswordToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  }
}
