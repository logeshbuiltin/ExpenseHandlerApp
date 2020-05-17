import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-expense-dialog',
  templateUrl: './expense-dialog.page.html',
  styleUrls: ['./expense-dialog.page.scss'],
  providers: [DatePipe]
})
export class ExpenseDialogPage implements OnInit {

  expMinDate: string;
  expMaxDate: string;
  expCurDate: Date;

  expenseForm : FormGroup;

  constructor(
    public datepipe: DatePipe,
    private formBuilder : FormBuilder,
    public modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    this.setInitValues()
  }

  setInitValues() {
    this.expenseForm = this.formBuilder.group({
      type : new FormControl('', Validators.compose([Validators.required])),        
      desc : new FormControl('', Validators.compose([Validators.required])),
      amount : new FormControl('', Validators.compose([Validators.required])),
      expDate : new FormControl('', Validators.compose([Validators.required]))
    });
    let startYearDate =  new Date(new Date().getFullYear(), 0, 1);
    let endYearDate =  new Date(14, 0, 1);
    this.expCurDate = new Date();
    this.expMinDate = this.datepipe.transform(startYearDate,
      "yyyy-MM-dd"
    );
    this.expMaxDate = this.datepipe.transform(endYearDate,
      "yyyy-MM-dd"
    );
  }

  saveExpense() {
    console.log("saved");
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

}
