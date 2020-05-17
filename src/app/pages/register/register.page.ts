import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  createSuccess = false;
  registerCredentials = { name: '', email: '', password: '', confirmation_password: '' };

  registerForm : FormGroup;

  constructor(
    private nav: NavController,
    private formBuilder : FormBuilder,
    //private auth: AuthServiceProvider,
    private alertCtrl: AlertController
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
      currencyCode : new FormControl('', Validators.compose([Validators.required]))
   });
  }

  public register() {
    if (this.registerCredentials.password != this.registerCredentials.confirmation_password) {
      this.showPopup("Error", 'The password confirmation does not match.');
    } else {
      // this.auth.register(this.registerCredentials).subscribe(success => {
      //   if (success) {
      //     this.createSuccess = true;
      //     this.showPopup("Success", "Account created.");
      //   } else {
      //     this.showPopup("Error", "Problem creating account.");
      //   }
      // },
      //   error => {
      //     this.showPopup("Error", error);
      // });
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

