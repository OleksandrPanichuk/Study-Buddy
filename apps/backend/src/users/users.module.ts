import { Module } from "@nestjs/common";
import { UsersRepository } from "@/users/users.repository";
import { UsersService } from "@/users/users.service";
import { UsersController } from "./users.controller";

@Module({
  controllers: [UsersController],
	providers: [UsersRepository, UsersService],
	exports: [UsersRepository]
})
export class UsersModule {}
