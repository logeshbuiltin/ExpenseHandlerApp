import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  registerCredentials = { email: '', password: '' };

  constructor(
    public nav: NavController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  ionViewDidEnter() {
  }

  public createAccount() {
    this.nav.navigateForward('RegisterPage');
  }

  public login() {
    //this.presentLoading()
    this.nav.navigateForward('/tabs');
    // this.auth.login(this.registerCredentials).subscribe(allowed => {
    //   if (allowed) {
    //     this.nav.navigateRoot('HomePage');
    //   } else {
    //     this.showError("These credentials do not match our records.");
    //   }
    // },
    // error => {
    //   this.showError(error);
    // });
  }

  forgotPass() {
    console.log("password");
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

}

