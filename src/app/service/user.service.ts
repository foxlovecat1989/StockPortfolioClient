import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CustomHttpRespone } from '../model/Custom-http-response';
import { User } from '../model/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/api/v1/user/findAll`);
  }

  public addUser(user: User): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/api/v1/user`, user);
  }

  public updateUser(user: User): Observable<User> {
    const loginUserNumber = user.userNumber;
    return this.http.patch<User>(`${environment.apiUrl}/api/v1/user/${loginUserNumber}`, user);
  }

  public resetPassword(email: string): Observable<CustomHttpRespone> {
    return this.http.get<CustomHttpRespone>(`${environment.apiUrl}/api/v1/user/resetpassword/${email}`);
  }

  public updateProfileImage(formData: FormData): Observable<HttpEvent<User>> {
    return this.http.post<User>(`${environment.apiUrl}/api/v1/user/updateProfileImage`, formData,
    {reportProgress: true,
      observe: 'events'
    });
  }

  public deleteUser(username: string): Observable<CustomHttpRespone> {
    return this.http.delete<CustomHttpRespone>(`${environment.apiUrl}/api/v1/user/${username}`);
  }

  public addUsersToLocalCache(users: User[]): void {
    localStorage.setItem('users', JSON.stringify(users));
  }

  public getUsersFromLocalCache(): User[] | null {
    if (localStorage.getItem('users')) {
        return JSON.parse(localStorage.getItem('users')!);
    }
    return null;
  }

  public createUserFormDate(loggedInUsername: string, user: User, profileImage: File): FormData {
    const formData = new FormData();
    formData.append('currentUsername', loggedInUsername);
    formData.append('username', user.username);
    formData.append('email', user.email);
    formData.append('role', user.userRole);
    formData.append('profileImage', profileImage);
    formData.append('isActive', JSON.stringify(user.isEnabled));
    formData.append('isNonLocked', JSON.stringify(user.isAccountNonLocked));

    return formData;
  }
}
