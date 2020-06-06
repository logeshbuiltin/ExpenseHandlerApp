import { Component, ViewEncapsulation } from '@angular/core';
import { NavController, ToastController, AlertController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { DataServiceProvider } from '../providers/data-service';
import { Storage } from '@ionic/storage';
import { currency_symbols } from 'src/assets/properties';

export interface Config {
	items: any;
}

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  providers: [DatePipe, DataServiceProvider],
  encapsulation: ViewEncapsulation.None
})
export class Tab2Page {

  currentDate: Date = new Date();
  minDate: any;
  maxDate: any;
  userId: any;
  selected: any;

  private rowAlert: any;

  constructor(
    public navCtrl 	: NavController,
    private datepipe: DatePipe,
    private dataService: DataServiceProvider,
    private storage: Storage,
    private toastController: ToastController,
    public alertContrl: AlertController,
    )
  {   
    // Define the columns for the data table
    // (based off the names of the keys in the JSON file)   
    this.columns = [
      { name: 'Type', prop: 'type'},
      { name: 'Amount', prop: 'amount'},
      { name: 'Desc', prop: 'desc'},
      { name: 'Date', prop: 'date'},
      { name: 'User', prop: 'user'}
    ];
  }

  ionViewDidEnter() {
    this.storage.get('userId').then((val) => {
      this.userId = val;
      let event = {value: this.currentDate};
      this.monthChange(event);
    });
    this.setCurrentMonth();
    //this.ionViewDidLoad();
  }

  setCurrentMonth() {
    let y = this.currentDate.getFullYear(), m = this.currentDate.getMonth();
    this.minDate = this.datepipe.transform(new Date(y-1, 12, 31), "yyyy-MM-dd");
    this.maxDate = this.datepipe.transform(new Date(y, 12-1, 30), "yyyy-MM-dd");
  }

  monthChange(event) {
    let selectDate = new Date(event.value);
    let y = selectDate.getFullYear(), m = selectDate.getMonth();
    let startDate = this.datepipe.transform(new Date(y, m, 1), "yyyy-MM-dd");
    let endDate = this.datepipe.transform(new Date(y, m+1, 0), "yyyy-MM-dd");
    this.dataService.dateFilter(startDate, endDate, this.userId).subscribe(allowed => {
      if (allowed) {
        this.storage.set('monthlyJsonData', allowed);
        this.ionViewDidLoad(allowed);
      } else {
        this.toastError("Warning" ,"No records found for the selected Month.");
      }
    },
    error => {
      this.toastError("Error", error);
    });
  }


   /**
    * @name config
    * @type {any}
    * @public
    * @description     Defines an object allowing the interface properties to be accessed 
    */
   public config : Config;




   /**
    * @name columns
    * @type {any}
    * @public
    * @description     Defines an object for storing the column definitions of the datatable 
    */
   public columns : any;




   /**
    * @name rows
    * @type {any}
    * @public
    * @description     Defines an object for storing returned data to be displayed in the template 
    */
   public rows : any;


   /**
    * Retrieve the technologies.json file (supplying the data type, via 
    * the config property of the interface object, to 'instruct' Angular 
    * on the 'shape' of the object returned in the observable and how to 
    * parse that)
    *
    * @public
    * @method ionViewDidLoad
    * @return {none}
    */
   ionViewDidLoad(dataDetails) : void
   {
     let modifiedData = [];
     let dataList = [];
     if(dataDetails.items) {
      dataList = dataDetails.items;
     } else {
      this.storage.get('monthlyJsonData').then((val) => {
        dataList = val.items;
      });
     }
    if(dataList.length > 0) {
      dataList.forEach(element => {
        let dataList = {
          Id: element.id,
          type: element.purchaseType == "income"? "Income": "Expense",
          amount: (currency_symbols[element.currCode]!==undefined? currency_symbols[element.currCode]: element.currCode) + 
                  element.entryAmount.toFixed(2),
          desc: element.description,
          date: this.datepipe.transform(new Date(element.purchaseDate), "dd-MMM"),
          user: element.addedBy
        }
        modifiedData.push(dataList);
      });
      this.rows = modifiedData.length > 0? modifiedData: [];
    } else {
      this.rows = [];
      this.toastError("Warning", "No records found for the selected Month.");
    }

   }

   async rowSelected(event){
    if (event.type == 'click' && event.cellIndex != 0) {
      let dataVal = event.row; 
      this.selected = "<p class='text-color'><strong>Type: </strong>" +dataVal.type+
                      "<br><strong>Amount: </strong>"+dataVal.amount+
                      "<br><strong>Desc: </strong>"+dataVal.desc+ 
                      "<br><strong>Date: </strong>"+dataVal.date+
                      "<br><strong>Added by: </strong>"+dataVal.user+"</p>"
      this.rowAlert = await this.alertContrl.create({
        cssClass: 'my-custom-class',
        header: 'Selected row details',
        message: this.selected,
        buttons: [
          {
              text: 'Dismiss',
              role: 'cancel',
          }
        ],
      });

      await this.rowAlert.present();
    }
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
