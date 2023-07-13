import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { from,lastValueFrom,Observable } from 'rxjs';

import { OktaAuth } from '@okta/okta-auth-js';
import { OKTA_AUTH } from '@okta/okta-angular';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return from(this.handleAccess(request,next));
  }

  private async handleAccess(request:HttpRequest<any>,next:HttpHandler):Promise<HttpEvent<any>>{
    const theEndPoint=environment.LilyUrl+'/orders';
    const securedEndPoints=[theEndPoint];
    if(securedEndPoints.some(url=>request.urlWithParams.includes(url))){
       const accessToken=this.oktaAuth.getAccessToken();
       request=request.clone({
        setHeaders:{
          Authorization:'Bearer '+accessToken
        }
       });
    }
    return await lastValueFrom(next.handle(request));
  }
    
  constructor(@Inject(OKTA_AUTH)private oktaAuth:OktaAuth) { }
}
