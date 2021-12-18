import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../model/user';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private token!: string;
  private loggedInUsername!: string;

  constructor(
    private http: HttpClient,
    private helper: JwtHelperService,
    private router: Router
    ) {}

  public login(user: User): Observable<HttpResponse<User>> {
    return this.http.post<User>(`${environment.apiUrl}/api/v1/user/login`, user, { observe: 'response' });
  }

  public register(user: User): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/api/v1/registration`, user);
  }

  public logOut(): void {
    this.token != null;
    this.loggedInUsername != null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('users');
  }

  public saveToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  public addUserToLocalCache(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  public getUserFromLocalCache(): User {
    return JSON.parse(localStorage.getItem('user')!);
  }

  public loadToken(): void {
    this.token = localStorage.getItem('token')!;
  }

  public getToken(): string {
    return this.token;
  }

  public isUserLoggedIn(): boolean {
    this.loadToken();
    const decodedTokenSub = this.helper.decodeToken(this.token);
    const isTokenNullOrEmpty = (this.token == null || this.token === '');
    const isTokenSubjectNullOrEmpty = (decodedTokenSub == null || decodedTokenSub === '');
    const isTokenExpired = this.helper.isTokenExpired(this.token);

    if (isTokenNullOrEmpty || isTokenSubjectNullOrEmpty || isTokenExpired){
      this.logOut();
      return false;
    }

    this.loggedInUsername = decodedTokenSub;
    return true;
  }

  public checkUserLoggedIn() : void {
    if (this.isUserLoggedIn())
      this.router.navigateByUrl('/user/management');
    else
      this.router.navigateByUrl('/login')
  }

}
