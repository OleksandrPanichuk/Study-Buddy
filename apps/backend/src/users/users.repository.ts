import { PrismaService } from "@app/prisma";
import { Injectable } from "@nestjs/common";
import type { User } from "@prisma/generated/client";
import type { TUserWithAvatar } from "@repo/schemas";
import type {
  ICreateUserData,
  IUpdateFailedLoginAttemptsData,
} from "@/users/interfaces";

@Injectable()
export class UsersRepository {
  constructor(private readonly db: PrismaService) {}

  public findById(userId: string): Promise<TUserWithAvatar | null> {
    return this.db.user.findUnique({
      where: { id: userId },
      include: {
        avatar: true,
      },
    });
  }

  public findByEmail(email: string): Promise<TUserWithAvatar | null> {
    return this.db.user.findUnique({
      where: { email },
      include: { avatar: true },
    });
  }

  public findByEmailOrUsername(
    email: string,
    username: string,
  ): Promise<User | null> {
    return this.db.user.findFirst({
      where: {
        OR: [
          {
            email,
          },
          {
            username,
          },
        ],
      },
    });
  }

  public create(data: ICreateUserData): Promise<User> {
    return this.db.user.create({
      data: {
        email: data.email,
        username: data.username,
        hash: data.hash,
        failedLoginAttempts: 0,
        avatar: data.avatarUrl
          ? {
              create: {
                url: data.avatarUrl,
              },
            }
          : undefined,
      },
    });
  }

  public getFailedLoginAttempts(
    userId: string,
  ): Promise<{ failedLoginAttempts: number } | null> {
    return this.db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        failedLoginAttempts: true,
      },
    });
  }
  public async updateFailedLoginAttempts(
    userId: string,
    data: IUpdateFailedLoginAttemptsData,
  ): Promise<User> {
    return this.db.user.update({
      where: {
        id: userId,
      },
      data: {
        failedLoginAttempts: data.attempts,
        lockedUntil: data.lockedUntil,
      },
    });
  }

  public resetFailedLoginAttempts(userId: string): Promise<User> {
    return this.db.user.update({
      where: {
        id: userId,
      },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });
  }

  public updatePassword(userId: string, hash: string): Promise<User> {
    return this.db.user.update({
      where: {
        id: userId,
      },
      data: {
        hash,
      },
    });
  }
  public updateVerificationStatus(userId: string): Promise<User> {
    return this.db.user.update({
      where: {
        id: userId,
      },
      data: {
        emailVerified: true,
      },
    });
  }
}
