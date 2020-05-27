import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { BASE_URL } from 'src/assets/properties';

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthServiceProvider {
  
  static readonly LOGIN_URL = 'auth';
  static readonly REGISTER_URL = 'register/user/';
  static readonly FORGET_URL = 'forgetpassword/user';
  access: boolean;
  token: string;

  constructor(
    public http: HttpClient,
    private storage: Storage
  ) {}

  // Login
  public login(credentials) {
    // let headers = new HttpHeaders({
    //   "Access-Control-Allow-Origin": "http://localhost:8100",
    //   "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT",
    //   "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
    //   "Accept": "application/json",
    //   "content-type": "application/json",
    //   "Access-Control-Allow-Credentials": "true"
    // });

    if (credentials.emailId === null || credentials.password === null) {
      return Observable.throw("Please insert credentials.");
    } else {
      return Observable.create(observer => {
        const credData = {
          "username": credentials.emailId,
          "password": credentials.password
        }

        this.http.post(BASE_URL+AuthServiceProvider.LOGIN_URL, credData)
        .pipe(map((res: any) => res))
        .subscribe( data => {
          if (data.access_token) {
            this.token = 'Bearer ' + data.access_token;
            this.access = true;
          } else {
            this.access = false;
          }
          observer.next(this.access);
          setTimeout(() => {
            observer.complete();
          }, 5000);
        }, error => {
          observer.next(this.access = false);
          setTimeout(() => {
            observer.complete();
          }, 5000);
        });
        // setTimeout(() => {
        //       observer.next(this.access);
        //   }, 500);

      }, err => console.error(err));
    }
  }

  // Register
  public register(credentials) {
    if (credentials.firstName === null || credentials.lastName === null || credentials.emailId === null
      || credentials.password === null || credentials.emailId === null || credentials.phoneNo === null
      || credentials.currencyCode === null) {
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {
        const regDetails = {
          "username": credentials.emailId,
          "password": credentials.password,
          "firstname": credentials.firstName,
          "lastname": credentials.lastName,
          "emailId": credentials.emailId,
          "phoneNo": credentials.phoneNo,
          "currCode": credentials.currencyCode,
          "favorite": credentials.security
        }
        this.http.post(BASE_URL+AuthServiceProvider.REGISTER_URL + credentials.emailId, regDetails)
        .pipe(map((res: any) => res))
        .subscribe( data => {
          console.log(data);
          observer.next(data);
          observer.complete();
        }, error => {
          observer.next(false);
          observer.complete();
        });
      });
    }
  }

  public storeUserData(credentials) {
    if (credentials.emailId != null || credentials.password != null) {
      this.http.get(BASE_URL+AuthServiceProvider.REGISTER_URL + credentials.emailId)
      .pipe(map((res: any) => res))
      .subscribe( data => {
        if (data.username) {
          this.storage.set('userId', data.id);
          this.storage.set('username', data.username);
          this.storage.set('password', data.password);
          this.storage.set('firstname', data.firstname);
          this.storage.set('lastname', data.lastname);
          this.storage.set('emailId', data.emailId);
          this.storage.set('phoneNo', data.phoneNo);
          this.storage.set('currCode', data.currCode);
        } 
      }, error => {
        console.log(error);
      });
    }
  }

  public updateUser(credentials) {
    if (credentials.emailId === null || credentials.userId === null) {
      return Observable.throw("User information not found to update");
    } else {
      return Observable.create(observer => {
        const regDetails = {
          "username": credentials.emailId,
          "password": credentials.password,
          "firstname": credentials.firstName,
          "lastname": credentials.lastName,
          "emailId": credentials.emailId,
          "phoneNo": credentials.phoneNo,
          "currCode": credentials.currCode,
          "security": credentials.security
        }
        this.http.put(BASE_URL+AuthServiceProvider.REGISTER_URL + credentials.userId, regDetails)
        .pipe(map((res: any) => res))
        .subscribe( data => {
          console.log(data);
          observer.next(data);
          observer.complete();
        }, error => {
          observer.next(false);
          observer.complete();
        });
      });
    }
  }

  public forgetPass(credentials) {
    return Observable.create(observer => {
      const regDetails = {
        "username": credentials.username,
        "favorite": credentials.security
      }
      this.http.post(BASE_URL+AuthServiceProvider.FORGET_URL, regDetails)
      .pipe(map((res: any) => res))
      .subscribe( data => {
        console.log(data);
        observer.next(data);
        observer.complete();
      }, error => {
        observer.next(false);
        observer.complete();
      });
    });
  }

  // Get Token
  public getToken() {
    return this.token;
  }

  // Logout
  public logout() {
    return Observable.create(observer => {
      observer.next(true);
      observer.complete();
    });
  }

}