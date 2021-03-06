import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { AuthServiceProvider } from '../providers/auth-service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  providers:[AuthServiceProvider]
})
export class Tab3Page {

  //user details
  userId: any;
  userName: any;
  firstName: string;
  lastName: string;
  emailId: any;
  password: any;
  phoneNo: any;
  currCode: any;
  confirmPass: any;

  isformValid: boolean = true;

  dynamicButton: string = "Edit";

  //flags
  isDisabled: boolean = true;

  constructor(
    private storage: Storage,
    public nav: NavController,
    private loadingCtrl: LoadingController,
    private auth: AuthServiceProvider,
    public toastController: ToastController,
  ) {}

  ionViewDidEnter() {
    this.setInitialValues();
  }

  setInitialValues() {
    this.storage.get('userId').then((val) => {
      this.userId = val;
    });
    this.storage.get('username').then((val) => {
      this.userName = val;
    });
    this.storage.get('firstname').then((val) => {
      this.firstName = val;
    });
    this.storage.get('lastname').then((val) => {
      this.lastName = val;
    });
    this.storage.get('emailId').then((val) => {
      this.emailId = val;
    });
    this.storage.get('phoneNo').then((val) => {
      this.phoneNo = val;
    });
    this.storage.get('currCode').then((val) => {
      this.currCode = val;
    });
    this.storage.get('password').then((val) => {
      this.confirmPass = val;
    });
  }

  enableFields() {
    if(this.dynamicButton == "Edit") {
      this.isDisabled = false;
      this.dynamicButton = "Cancel";
    } else {
      this.setInitialValues();
      this.isDisabled = true;
      this.dynamicButton = "Edit";
    }
  }

  async updateUser() {
    if(this.password) {
      this.confirmPass = this.password;
    }
    const userData = {
      "userId": this.userId,
      "username": this.userName,
      "password": this.confirmPass,
      "firstName": this.firstName,
      "lastName": this.lastName,
      "emailId": this.emailId,
      "phoneNo": this.phoneNo,
      "currCode": this.currCode
    }
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
    });
    this.auth.updateUser(userData).subscribe(allowed => {
      if (allowed) {
        this.auth.storeUserData(userData);
        this.isDisabled = true;
        this.dynamicButton = "Edit";
        loading.dismiss();
        this.toastError("Success", "Details have been updated successfully");
      } else {
        loading.dismiss();
        this.toastError("Error", "Unable to update user details");
      }
    },
    error => {
      loading.dismiss();
      this.toastError("Error", error);
    });
    await loading.present();
    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

  checkValidity(type) {
    if(type == "number") {
      let digits = (""+this.phoneNo).split("");
      if(digits.length > 13) {
        this.phoneNo = "";
        this.toastError("Error", "Phone number can not exceed more than 13 characters");
      } 
    } else if(type == "password") {
      let digits = (""+this.password).split("");
      if(digits.length < 8) {
        this.password = "";
        this.toastError("Error", "password should be more than 8 characters in length");
      }
    } else if (type == "email") {
      if(!this.emailId.match("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")) {
        this.storage.get('emailId').then((val) => {
          this.emailId = val;
        });
        this.toastError("Error", "Email-id format is invalid, replacing the old email");
      }
    }
  }

  logoutUser() {
    this.storage.clear();
    this.nav.navigateForward('/login');
  }

  async toastError(header, text) {
    const toast = await this.toastController.create({
      header: header,
      message: text,
      duration: 3000,
      position: 'top',
    });
    toast.present();
  }
}
