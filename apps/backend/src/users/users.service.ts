import { UsersRepository } from "@/users/users.repository";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(private readonly usersRepository: UsersRepository) {}

  public async findById(userId: string) {
    this.logger.debug(`Looking up user by id: ${userId}`);
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      this.logger.warn(`User not found: ${userId}`);
      throw new NotFoundException("User not found");
    }

    return user;
  }
}
