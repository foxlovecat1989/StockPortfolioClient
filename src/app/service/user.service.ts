import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CustomHttpRespone } from '../model/custom-http-response';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/api/v1/user/findAll`).pipe(
      map(
        users => {
          const newUsers = new Array<User>();
          users.forEach(user => newUsers.push(User.fromHttp(user)));
          return newUsers;
        }
      )
    );
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/api/v1/user`, user);
  }

  updateUser(user: User): Observable<User> {
    return this.http.patch<User>(`${environment.apiUrl}/api/v1/user/update`, user);
  }

  updateUserNameOrEmail(user: User): Observable<User> {

    return this.http.patch<User>(`${environment.apiUrl}/api/v1/user/modified`, user);
  }

  resetPassword(email: string): Observable<CustomHttpRespone> {
    return this.http.get<CustomHttpRespone>(`${environment.apiUrl}/api/v1/user/resetpassword/${email}`);
  }

  updateProfileImage(formData: FormData): Observable<HttpEvent<User>> {
    return this.http.post<User>(`${environment.apiUrl}/api/v1/user/updateProfileImage`, formData,
    {reportProgress: true,
      observe: 'events'
    });
  }

  deleteUser(username: string): Observable<CustomHttpRespone> {
    return this.http.delete<CustomHttpRespone>(`${environment.apiUrl}/api/v1/user/${username}`);
  }

  addUsersToLocalCache(users: User[]): void {
    localStorage.setItem('users', JSON.stringify(users));
  }

  getUsersFromLocalCache(): User[] | null {
    if (localStorage.getItem('users')) {
        return JSON.parse(localStorage.getItem('users')!);
    }
    return null;
  }

  createUserFormDate(loggedInUsername: string, user: User, profileImage: File): FormData {
    const formData = new FormData();
    formData.append('currentUsername', loggedInUsername);
    formData.append('username', user.username);
    formData.append('email', user.email);
    formData.append('role', user.userRole);
    formData.append('profileImage', profileImage);
    formData.append('isActive', JSON.stringify(user.enabled));
    formData.append('isNonLocked', JSON.stringify(user.accountNonLocked));

    return formData;
  }
}
