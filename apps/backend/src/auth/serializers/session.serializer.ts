import { Injectable, Logger } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { UsersRepository } from "@/users/users.repository";
import { User } from "@prisma/generated/client";

@Injectable()
export class SessionSerializer extends PassportSerializer {
  private readonly logger = new Logger(SessionSerializer.name);

  constructor(private readonly usersRepository: UsersRepository) {
    super();
  }

  async serializeUser(
    user: User,
    done: (err: unknown, userId: string | null) => void,
  ) {
    try {
      this.logger.log(`Serializing user: ${user.id}`);
      done(null, user.id);
    } catch (err) {
      this.logger.error(`Error serializing user: ${err}`);
      done(err, null);
    }
  }

  async deserializeUser(
    userId: string,
    done: (err: unknown, user: User | null) => void,
  ) {
    try {
      this.logger.log(`Deserializing user: ${userId}`);
      const user = await this.usersRepository.findById(userId);
      if (user) {
        this.logger.log(`User found: ${user.id}`);
      } else {
        this.logger.warn(`User not found: ${userId}`);
      }
      done(null, user);
    } catch (err) {
      this.logger.error(`Error deserializing user: ${err}`);
      done(err, null);
    }
  }
}
