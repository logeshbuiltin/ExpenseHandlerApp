import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthServiceProvider } from 'src/app/providers/auth-service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  providers: [AuthServiceProvider]
})
export class RegisterPage implements OnInit {

  phoneNo: number;
  passwordMod: any;
  cPasswordMod: any;
  emailId: any;

  createSuccess = false;

  registerForm : FormGroup;

  constructor(
    private nav: NavController,
    private formBuilder : FormBuilder,
    private auth: AuthServiceProvider,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.setInitValues()
  }

  setInitValues() {
    this.registerForm = this.formBuilder.group({
      firstName : new FormControl('', Validators.compose([Validators.required])),        
      lastName : new FormControl('', Validators.compose([Validators.required])),
      emailId : new FormControl('', Validators.compose([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")])),
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

  checkValidity(type) {
    if(type == "number") {
      let digits = (""+this.phoneNo).split("");
      if(digits.length > 13) {
        this.registerForm.controls['phoneNo'].setErrors({'incorrect': true});
        this.toastError("Error", "Phone number can not exceed more than 13 characters");
      } else {
        this.registerForm.controls['phoneNo'].setErrors({'firstError': null});
        this.registerForm.controls['phoneNo'].updateValueAndValidity();
      }
    } else if(type == "password") {
      let digits = (""+this.passwordMod).split("");
      if(digits.length < 8) {
        this.registerForm.controls['password'].setErrors({'incorrect': true});
        this.toastError("Error", "password should be more than 8 characters in length");
      } else {
        this.registerForm.controls['password'].setErrors({'firstError': null});
        this.registerForm.controls['password'].updateValueAndValidity();
      }
    }
  }

  checkPassword() {
    if(this.passwordMod != this.cPasswordMod) {
      this.registerForm.controls['confirm_password'].setErrors({'incorrect': true});
      this.toastError("Error", "confirm password does not match with actual password");
    } else {
      this.registerForm.controls['confirm_password'].setErrors({'firstError': null});
      this.registerForm.controls['confirm_password'].updateValueAndValidity();
    }
  }

  async toastError(type,text) {
    const toast = await this.toastController.create({
      header: type,
      message: text,
      duration: 3000,
      position: 'bottom',
    });
    toast.present();
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

