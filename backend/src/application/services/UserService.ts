import { User } from "@/domain/models/User";
import { UserRepository } from "@/infrastructure/repositories/UserRepository";

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createOrUpdateUser(dynamicUser: any): Promise<User> {
    const user = User.fromDynamic(dynamicUser);
    const existingUser = await this.userRepository.findByEmail(user.email);

    if (existingUser) {
      return this.userRepository.update(user);
    } else {
      return this.userRepository.create(user);
    }
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async deleteUser(id: string): Promise<void> {
    return this.userRepository.delete(id);
  }
}
