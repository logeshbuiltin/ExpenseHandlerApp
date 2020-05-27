import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthServiceProvider } from 'src/app/providers/auth-service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  providers: [AuthServiceProvider]
})
export class RegisterPage implements OnInit {

  createSuccess = false;

  registerForm : FormGroup;

  constructor(
    private nav: NavController,
    private formBuilder : FormBuilder,
    private auth: AuthServiceProvider,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
  ) {}

  ngOnInit() {
    this.setInitValues()
  }

  setInitValues() {
    this.registerForm = this.formBuilder.group({
      firstName : new FormControl('', Validators.compose([Validators.required])),        
      lastName : new FormControl('', Validators.compose([Validators.required])),
      emailId : new FormControl('', Validators.compose([Validators.required])),
      password : new FormControl('', Validators.compose([Validators.required])),
      confirm_password : new FormControl('', Validators.compose([Validators.required])),
      phoneNo : new FormControl('', Validators.compose([Validators.required])),
      currencyCode : new FormControl('', Validators.compose([Validators.required])),
      security: new FormControl('', Validators.compose([Validators.required]))
   });
  }

  async register() {
    let userdata = this.registerForm.value;
    if (userdata.password != userdata.confirm_password) {
      this.showPopup("Error", 'The password confirmation does not match.');
    } else {
      const loading = await this.loadingCtrl.create({
        message: 'Please wait...',
      });
      this.auth.register(userdata).subscribe(success => {
        if (success.registration) {
          if(success.registration == "success") {
            this.createSuccess = true;
            this.showPopup("Success", "Account created.");
            this.nav.navigateForward('/login');
          } else if(success.registration == "exists") {
              this.showPopup("Warning", "Email-Id already exists.");
          }
        }
        else {
          this.showPopup("Error", "Problem creating account.");
        }
        loading.dismiss();
      },
        error => {
          loading.dismiss();
          this.showPopup("Error", error);
      });
      await loading.present();
      const { role, data } = await loading.onDidDismiss();
      console.log('Loading dismissed!');
    }
  }


  async showPopup(title, text) {
    let alert = await this.alertCtrl.create({
      message: title,
      subHeader: text,
      buttons: [
        {
          text: 'OK',
          handler: data => {
            if (this.createSuccess) {
              this.nav.navigateRoot;
            }
          }
        }
      ]
    });
    alert.present();
  }

}

