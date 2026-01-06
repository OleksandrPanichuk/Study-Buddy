import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { UsersRepository } from "@/users/users.repository";
import { User } from "@prisma/generated/client";

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly usersRepository: UsersRepository) {
    super();
  }

  async serializeUser(
    user: User,
    done: (err: unknown, userId: string | null) => void,
  ) {
    try {
      done(null, user.id);
    } catch (err) {
      done(err, null);
    }
  }

  async deserializeUser(
    userId: string,
    done: (err: unknown, user: User | null) => void,
  ) {
    try {
      const user = await this.usersRepository.findById(userId);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
}
