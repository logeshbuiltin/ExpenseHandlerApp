import { Component, ViewEncapsulation } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { DataServiceProvider } from '../providers/data-service';
import { Storage } from '@ionic/storage';

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

  constructor(
    public navCtrl 	: NavController,
    private datepipe: DatePipe,
    private dataService: DataServiceProvider,
    private storage: Storage,
    private toastController: ToastController,
    )
  {   
    // Define the columns for the data table
    // (based off the names of the keys in the JSON file)   
    this.columns = [
      { prop: 'Type' },
      { name: 'Amount' },
      { name: 'Desc' },
      { name: 'Date' },
      { name: 'AddedBy' }
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
        this.toastError("Unable to fetch records for the selected Month.");
      }
    },
    error => {
      this.toastError(error);
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
          Type: element.purchaseType,
          amount: element.entryAmount.toFixed(2),
          desc: element.description,
          date: this.datepipe.transform(new Date(element.purchaseDate), "dd-MMM"),
          addedBy: element.addedBy
        }
        modifiedData.push(dataList);
      });
      this.rows = modifiedData.length > 0? modifiedData: [];
    } else {
      this.rows = [];
      this.toastError("No records found for the selected Month.");
    }
      // this._HTTP
      // .get<Config>('../../assets/data/technologies.json')
      // .subscribe((data) =>
      // {
      //   data.items.forEach(element => {
      //     let dataList = {
      //       Id: element.id,
      //       Type: element.purchaseType,
      //       amount: element.entryAmount.toFixed(2),
      //       desc: element.description,
      //       date: this.datepipe.transform(new Date(element.purchaseDate), "dd-MMM"),
      //       addedBy: element.addedBy
      //     }
      //     modifiedData.push(dataList);
      //   });
      //   this.rows = modifiedData.length > 0? modifiedData: [];
      // });

   }

   async toastError(text) {
    const toast = await this.toastController.create({
      header: 'Error ',
      message: text,
      duration: 3000,
      position: 'top',
    });
    toast.present();
  }
}
