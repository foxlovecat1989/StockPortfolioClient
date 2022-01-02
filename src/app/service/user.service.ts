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

  register(user: User): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/api/v1/registration`, user);
  }

  updateUser(user: User): Observable<User> {
    return this.http.patch<User>(`${environment.apiUrl}/api/v1/user/update`, user);
  }

  updateUserNameOrEmail(user: User): Observable<User> {
    return this.http.patch<User>(`${environment.apiUrl}/api/v1/user/modified`, user);
  }

  deleteUser(userNumber: string): Observable<CustomHttpRespone> {
    return this.http.delete<CustomHttpRespone>(`${environment.apiUrl}/api/v1/user/${userNumber}`);
  }

  addUsersToLocalCache(users: User[]): void {
    localStorage.setItem('users', JSON.stringify(users));
  }

  resetPassword(email: string): Observable<CustomHttpRespone> {
    return this.http.get<CustomHttpRespone>(`${environment.apiUrl}/api/v1/user/reset/password/${email}`);
  }

  updateProfileImage(userNumber: String, formData: FormData): Observable<HttpEvent<User>> {
    return this.http.post<User>(`${environment.apiUrl}/api/v1/user/updateProfileImage/${userNumber}`, formData,
    {reportProgress: true,
      observe: 'events'
    });
  }


}
