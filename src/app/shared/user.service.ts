import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs';
import { User } from './user.model';

@Injectable()
export class UserService {
  readonly rootUrl = 'https://jquearyajaxinaspnetmvc.azurewebsites.net/';
  constructor(private http: HttpClient) { }

  registerUser(user : User){
    const body: User = {
      UserName: user.UserName,
      Password: user.Password,
      confirmPassword: user.confirmPassword,
      Email: user.Email,
      FirstName: user.FirstName,
      LastName: user.LastName
    }
    return this.http.post(this.rootUrl + 'api/User/Register', body);
    }
    
    userAuthentication(userName, password) {
      var data = "username=" + userName + "&password=" + password + "&grant_type=password";
      var reqHeader = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded','No-Auth':'True' });
      return this.http.post(this.rootUrl + '/token', data, { headers: reqHeader });
    }

    getUserClaims(){
      return  this.http.get(this.rootUrl+'/api/GetUserClaims');
     }
  }