export class User {
  id!: string;
  username!: string;
  userNumber!: string;
  email!: string;
  lastLoginDate!: string;
  lastLoginDateDisplay!: string;
  joinDate!: string;
  profileImageUrl!: string;
  isEnabled!: boolean;
  isAccountNonLocked!: boolean;
  userRole!: string;

  static fromHttp(user: User): User{
    const newUser = new User();
    newUser.id = user.id;
    newUser.username = user.username;
    newUser.userNumber = user.userNumber;
    newUser.email = user.email;
    newUser.lastLoginDate = user.lastLoginDate;
    newUser.joinDate = user.joinDate;
    newUser.profileImageUrl = user.profileImageUrl;
    newUser.isEnabled = user.isEnabled;
    newUser.isAccountNonLocked = user.isAccountNonLocked;
    newUser.userRole = user.userRole;

    return newUser;
  }
}

