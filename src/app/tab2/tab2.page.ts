import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';

export interface Config {
	technologies: string;
}

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class Tab2Page {

  constructor(
    public navCtrl 	: NavController,
    private _HTTP   	: HttpClient) 
  {   
    // Define the columns for the data table
    // (based off the names of the keys in the JSON file)   
    this.columns = [
      { prop: 'name' },
      { name: 'Summary' },
      { name: 'Company' }
    ];
  }

  ionViewDidEnter() {
    this.ionViewDidLoad();
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
   ionViewDidLoad() : void
   {
      this._HTTP
      .get<Config>('../../assets/data/technologies.json')
      .subscribe((data) =>
      {
         this.rows = data.technologies;
      });

   }
}
