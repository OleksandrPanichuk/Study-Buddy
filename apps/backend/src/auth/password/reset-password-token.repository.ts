import { PrismaService } from "@app/prisma";
import { Injectable } from "@nestjs/common";
import type { ICreateResetPasswordTokenData } from "./reset-password-token.interfaces";

@Injectable()
export class ResetPasswordTokenRepository {
	constructor(private readonly db: PrismaService) {}

	public findByUserEmail(email: string) {
		return this.db.resetPasswordToken.findFirst({
			where: {
				user: {
					email
				},
				expiresAt: {
					gt: new Date()
				}
			}
		});
	}

	public create(data: ICreateResetPasswordTokenData) {
		return this.db.resetPasswordToken.create({
			data: {
				userId: data.userId,
				token: data.token,
				expiresAt: data.expiresAt,
				resendCount: data.resendCount ?? 0
			}
		});
	}

	public updateTokenAndIncrementResendCount(id: string, token: string) {
		return this.db.resetPasswordToken.update({
			where: {
				id
			},
			data: {
				token,
				resendCount: {
					increment: 1
				},
				lastSentAt: new Date()
			}
		});
	}

	public deleteByUserId(userId: string) {
		return this.db.resetPasswordToken.deleteMany({ where: { userId } });
	}

	public deleteExpired() {
		return this.db.resetPasswordToken.deleteMany({
			where: { expiresAt: { lt: new Date() } }
		});
	}
}
