import { UserRole } from "../enum/user-role";

export class User {
  id!: string;
  username!: string;
  userNumber!: string;
  email!: string;
  lastLoginDate!: string;
  lastLoginDateDisplay!: string;
  joinDate!: string;
  profileImageUrl!: string;
  enabled!: boolean;
  accountNonLocked!: boolean;
  userRole!: string;

  static fromHttp(user: User): User{
    const newUser = new User();
    newUser.id = user.id;
    newUser.username = user.username;
    newUser.userNumber = user.userNumber;
    newUser.email = user.email;
    newUser.lastLoginDate = user.lastLoginDate;
    newUser.lastLoginDateDisplay = user.lastLoginDateDisplay;
    newUser.joinDate = user.joinDate;
    newUser.profileImageUrl = user.profileImageUrl;
    newUser.enabled = user.enabled;
    newUser.accountNonLocked = user.accountNonLocked;
    newUser.userRole = user.userRole;

    return newUser;
  }
}

