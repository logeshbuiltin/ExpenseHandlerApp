import { Component, OnInit, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { DataServiceProvider } from 'src/app/providers/data-service';

@Component({
  selector: 'app-expense-dialog',
  templateUrl: './expense-dialog.page.html',
  styleUrls: ['./expense-dialog.page.scss'],
  providers: [DatePipe, DataServiceProvider]
})
export class ExpenseDialogPage implements OnInit {

  @Input() expenseData: any;
  @Input() opType: string;

  titleName: string = "Budget Entry Dialog";

  expMinDate: string;
  expMaxDate: string;
  expCurDate: Date;

  addedBy: any;
  desc: string;
  amount: number;
  type: any;
  expDate: any;
  itemId: any;
  currCode: any;

  userId: any;

  dynamicSave: string = "Save";

  expenseForm : FormGroup;

  constructor(
    public datepipe: DatePipe,
    private formBuilder : FormBuilder,
    public modalCtrl: ModalController,
    private storage: Storage,
    private dataService: DataServiceProvider,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.setInitValues()
  }

  setInitValues() {
    this.expCurDate = new Date();
    if(this.opType == "update" && this.expenseData) {
      this.itemId = this.expenseData.id;
      this.addedBy = this.expenseData.addedBy;
      this.desc = this.expenseData.description;
      this.amount = (this.expenseData.entryAmount).toFixed(2);
      this.type = this.expenseData.purchaseType;
      this.expDate = this.datepipe.transform(this.expenseData.purchaseDate, "yyyy-MM-dd");
      this.dynamicSave = "Update";
    } else {
      this.expDate = this.datepipe.transform(this.expCurDate, "yyyy-MM-dd");
      this.addedBy = "self";
    }
    this.storage.get('userId').then((val) => {
      this.userId = val;
    });
    this.storage.get('currCode').then((val) => {
      this.currCode = val;
    });
    this.expenseForm = this.formBuilder.group({
      type : new FormControl('', Validators.compose([Validators.required])),        
      desc : new FormControl('', Validators.compose([Validators.required])),
      amount : new FormControl('', Validators.compose([Validators.required])),
      expDate : new FormControl('', Validators.compose([Validators.required])),
      currCode: new FormControl('', Validators.compose([Validators.required])),
      addedBy: new FormControl('', Validators.compose([Validators.required]))
    });
    let startYearDate =  new Date(new Date().getFullYear(), 0, 1);
    let endYearDate =  new Date(14, 0, 1);
    this.expMinDate = this.datepipe.transform(startYearDate,
      "yyyy-MM-dd"
    );
    this.expMaxDate = this.datepipe.transform(endYearDate,
      "yyyy-MM-dd"
    );
  }

  performSave(formData) {
    if(this.opType == "update") {
      this.updateExpense(formData);
    } else if(this.opType == "save"){
      this.saveExpense(formData);
    }
  }

  updateExpense(formData){
    let expenseData = this.saveStructure(formData);
    this.dataService.updateExpense(this.itemId, expenseData).subscribe(allowed => {
      if (allowed) {
        if(allowed.id) {
          this.toastError("Success","Expense/Income has been saved.");
          this.dismiss();
        }
      } else {
        this.toastError("Error","Unable to save record.");
      }
    },
    error => {
      this.toastError("Error",error);
    });
  }

  saveExpense(formData) {
    let expenseData = this.saveStructure(formData);
    this.dataService.saveExpense(this.userId, expenseData).subscribe(allowed => {
      if (allowed) {
        if(allowed.id) {
          this.toastError("Success","Expense/Income has been saved.");
          this.dismiss();
        }
      } else {
        this.toastError("Error","Unable to save record.");
      }
    },
    error => {
      this.toastError("Error",error);
    });
  }

  saveStructure(formData) {
    return {
      "purchaseType": formData.type,
      "entryAmount": formData.amount,
      "description": formData.desc,
      "purchaseDate": this.datepipe.transform(formData.expDate, "yyyy-MM-dd"),
      "purchaseDay": this.getDayDetail(formData.expDate),
      "addedBy": formData.addedBy,
      "currCode": formData.currCode,
      "userId": 1
    }
  }

  getDayDetail(expDate: any) {
    let day = new Date(expDate).getDay();
    switch (day) {
      case 0: 
        return "Sun";
      case 1:
        return "Mon";
      case 2:
        return "Tue";
      case 3:
        return "Wed";
      case 4:
        return "Thu";
      case 5:
        return "Fri";
      case 6:
        return "Sat";
    }
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
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
