import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { AuthServiceProvider } from 'src/app/providers/auth-service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  providers:[AuthServiceProvider]
})
export class LoginPage {

  username: string;
  password: any;
  security: string;
  registerCredentials = { emailId: '', password: '' };

  //flags
  forgetPass: boolean = false;

  constructor(
    public nav: NavController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private auth: AuthServiceProvider,
    public toastController: ToastController,
    private storage: Storage,
  ) {}

  ionViewDidEnter() {
    this.checkUserExists();
  }

  checkUserExists() {
    this.storage.get('username').then((val) => {
      this.username = val;
    });
    this.storage.get('password').then((val) => {
      this.password = val;
    });
    if(this.username && this.password) {
      this.auth.login(this.registerCredentials).subscribe(allowed => {
        if (allowed) {
          this.nav.navigateForward('/tabs');
        } else {
          this.showError("Invalid user has been detected.");
          this.nav.navigateForward('/login');
        }
      },
      error => {
        this.showError(error);
      });
    }
  }

  public createAccount() {
    this.nav.navigateForward('RegisterPage');
  }

  public login() {
    if(!this.username) {
      this.toastError("Error","Invalid Username");
      return;
    }
    else if(!this.password) {
      this.toastError("Error","Invalid Password");
      return;
    }
    this.presentLoading()
    this.registerCredentials.emailId = this.username;
    this.registerCredentials.password = this.password;
    this.auth.login(this.registerCredentials).subscribe(allowed => {
      if (allowed) {
        this.auth.storeUserData(this.registerCredentials);
        this.clearAll();
        this.nav.navigateForward('/tabs');
      } else {
        this.showError("These credentials do not match our records.");
      }
    },
    error => {
      this.showError(error);
    });
  }

  clearAll() {
    this.username = "";
    this.password = "";
    this.security = "";
  }

  forgotPass() {
    this.forgetPass = true;
  }

  cancelpass() {
    this.security = "";
    this.forgetPass = false;
  }

  async sendPass() {
    if(this.username && this.security) {
      let userDetails = {
        username: this.username,
        security: this.security
      }
      const loading = await this.loadingCtrl.create({
        message: 'Please wait...',
      });
      this.auth.forgetPass(userDetails).subscribe(allowed => {
        if (allowed) {
          if(allowed.link == "sent") {
            this.toastError("Info", "Password has been send to your registered email");
            this.security = ""
            this.forgetPass = false;
          } else if (allowed.link == "error"){
            this.toastError("Error", "Unable to reset password");
          }
        } else {
          this.showError("There is error in reset password contact razerockztech@gmail.com.");
        }
        loading.dismiss();
      },
      error => {
        loading.dismiss();
        this.showError(error);
      });
      await loading.present();
      const { role, data } = await loading.onDidDismiss();
      console.log('Loading dismissed!');
    } else {
      this.toastError("Error", "Enter Username and Security answer to reset password");
    }
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 2000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

  async showError(text) {
    this.loadingCtrl.dismiss();

    let alert = await this.alertCtrl.create({
      message: 'Fail',
      subHeader: text,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  async toastError(type, text) {
    const toast = await this.toastController.create({
      header: type,
      message: text,
      duration: 3000,
      position: 'top',
    });
    toast.present();
  }

}

