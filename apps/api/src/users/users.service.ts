import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepo
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();
  }

  async create(
    firstName: string,
    lastName: string,
    email: string,
    hashedPassword: string,
    role = Role.USER,
  ): Promise<User> {
    const user = this.usersRepo.create({ firstName, lastName, email, password: hashedPassword, role });
    return this.usersRepo.save(user);
  }

  // Atomic increment — avoids race condition from read-then-write
  async incrementFailedAttempts(userId: string): Promise<void> {
    await this.usersRepo
      .createQueryBuilder()
      .update(User)
      .set({ failedAttempts: () => '"failedAttempts" + 1' })
      .where('id = :id', { id: userId })
      .execute();
  }

  async lockAccount(userId: string, until: Date): Promise<void> {
    await this.usersRepo
      .createQueryBuilder()
      .update(User)
      .set({ lockedUntil: until })
      .where('id = :id', { id: userId })
      .execute();
  }

  async resetLoginState(userId: string): Promise<void> {
    await this.usersRepo
      .createQueryBuilder()
      .update(User)
      .set({ failedAttempts: 0, lockedUntil: null })
      .where('id = :id', { id: userId })
      .execute();
  }
}
