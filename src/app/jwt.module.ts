import { NgModule } from "@angular/core";
import { JwtModule, JwtModuleOptions } from "@auth0/angular-jwt";
import { environment } from "src/environments/environment";

const JWT_Module_Options:
  JwtModuleOptions = {
    config: {
      tokenGetter: tokenGetter,
      allowedDomains: [environment.apiUrl],
      disallowedRoutes: environment.jwtTokenDisallowedRoutes,
    }
  };

export function tokenGetter() {
  return localStorage.getItem("token");
}

@NgModule({
  imports: [JwtModule.forRoot(JWT_Module_Options)],
  exports: [JwtModule]
})
export class JwtTokenModule {
}




