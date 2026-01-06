import type { TOAuthUser } from "@/auth/auth.types";
import { UsersRepository } from "@/users/users.repository";
import  { HashingService } from "@app/hashing";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
} from "@nestjs/common";
import type { User } from "@prisma/generated/client";
import { SignInInput, SignUpInput } from "@/auth/auth.dto";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  private readonly MAX_FAILED_ATTEMPTS = 5;
  private readonly LOCK_DURATION = 15 * 60 * 1000;

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashingService: HashingService,
  ) {}

  public async oauthSignIn(dto?: TOAuthUser): Promise<User> {
    if (!dto) {
      throw new BadRequestException("Invalid OAuth2 data");
    }
    const existingUser = await this.usersRepository.findByEmail(dto.email);

    if (!existingUser) {
      const newUser = await this.usersRepository.create({
        email: dto.email,
        username: dto.username,
        avatarUrl: dto.avatar.url,
      });

      await this.usersRepository.updateVerificationStatus(newUser.id);
      return newUser;
    }

    if (!existingUser.emailVerified) {
      await this.usersRepository.updateVerificationStatus(existingUser.id);
    }

    return existingUser;
  }

  public async signUp(dto: SignUpInput): Promise<User> {
    const existingUser = await this.usersRepository.findByEmailOrUsername(
      dto.email,
      dto.username,
    );

    if (existingUser?.username === dto.username) {
      throw new ConflictException("Username already in use");
    }
    if (existingUser?.email === dto.email) {
      throw new ConflictException("Email already in use");
    }

    const hashedPassword = await this.hashingService.hash(dto.password);

    const newUser = await this.usersRepository.create({
      hash: hashedPassword,
      email: dto.email,
      username: dto.username,
    });

    this.logger.log(`New user registered: ${newUser.id}`);

    return newUser;
  }

  public async singIn(dto: SignInInput): Promise<User> {
    const user = await this.usersRepository.findByEmail(dto.email);

    if (!user) {
      throw new BadRequestException("Invalid email or password");
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      this.logger.warn(`Failed login attempts. Email: ${user.email}`);

      throw new ForbiddenException(
        "Too many failed attempts. Please try again later.",
      );
    }

    if (!user.hash) {
      throw new BadRequestException("Invalid email or password");
    }

    const isValidPassword = await this.hashingService.verify(
      user.hash,
      dto.password,
    );

    if (!isValidPassword) {
      this.logger.warn(`Failed login attempt. Email: ${user.email}`);
      await this.handleFailedLogin(user.id, user.email);
      throw new BadRequestException("Invalid email or password");
    }

    await this.resetFailedAttempts(user.id);

    return user;
  }

  private async resetFailedAttempts(userId: string) {
    await this.usersRepository.resetFailedLoginAttempts(userId);
  }

  private async handleFailedLogin(userId: string, email: string) {
    const user = await this.usersRepository.getFailedLoginAttempts(userId);

    const attempts = (user?.failedLoginAttempts || 0) + 1;
    const shouldLock = attempts >= this.MAX_FAILED_ATTEMPTS;

    const lockedUntil = shouldLock
      ? new Date(Date.now() + this.LOCK_DURATION)
      : null;

    await this.usersRepository.updateFailedLoginAttempts(userId, {
      attempts,
      lockedUntil,
    });

    if (shouldLock) {
      this.logger.warn(
        `Account locked due to ${attempts} failed attempts. User ID: ${userId}, Email: ${email}`,
      );
    } else {
      this.logger.warn(
        `Failed login attempt ${attempts}/${this.MAX_FAILED_ATTEMPTS}. User ID: ${userId}, Email: ${email}`,
      );
    }
  }
}
