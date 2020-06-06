import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, ModalController, ToastController, AlertController, Platform } from '@ionic/angular';
import * as HighCharts from 'highcharts';
import { ExpenseDialogPage } from '../modals/expense-dialog/expense-dialog.page';
import { Storage } from '@ionic/storage';
import { DatePipe } from '@angular/common';
import { DataServiceProvider } from '../providers/data-service';
import { IonContent } from '@ionic/angular';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  providers: [DatePipe, DataServiceProvider]
})
export class Tab1Page {

  @ViewChild(IonContent) content: IonContent;

  expenseData: any[] = [];
  incomeData: any[] = [];
  daysData: any[] = [];
  totalRecords: any[] = [];
  expenseList: any[] = [];
  incomeList: any[] = [];
  bothEandIList: any[] = [];
  userId: any;
  highTab: string = "t1";

  totalBatch: number;
  expenseBatch: number;
  incomeBatch: number;

  currentDate: Date = new Date();
  startDate: any;
  endDate: any;
  currentMonth: string;

  //total amount
  totalSavings: number = 0;
  totalExpense: number = 0;
  totalIncome: number = 0;

  myCurrency: string;

  constructor(
    public nav: NavController,
    public modalController: ModalController,
    private storage: Storage,
    private datepipe: DatePipe,
    private dataService: DataServiceProvider,
    private toastController: ToastController,
    public alertController: AlertController,
    private platform: Platform
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      navigator['app'].exitApp();
    });
  }


  ionViewDidEnter(): void {
    this.pageScroller();
    this.getUserDetails();
    this.daysData = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  }
  
  getUserDetails() {
    this.currentMonth = this.datepipe.transform(this.currentDate, "MMM yyyy");
    let y = this.currentDate.getFullYear(), m = this.currentDate.getMonth();
    this.startDate = this.datepipe.transform(new Date(y, m, 1), "yyyy-MM-dd");
    this.endDate = this.datepipe.transform(new Date(y, m+1, 0), "yyyy-MM-dd");
    this.storage.ready().then(() => {
      this.storage.get('currCode').then((val) => {
        this.myCurrency = val;
      });
      this.getExpenseData();
    }).catch((error: Error) => {
      console.error(error);
      return;
    });
  }

  getExpenseData() {
    this.storage.get('userId').then((val) => {
      this.userId = val;
      if(this.userId) {
        this.totalRecords = [];
        this.dataService.dateFilter(this.startDate, this.endDate, this.userId).subscribe(allowed => {
          if (allowed) {
            if(allowed.items.length > 0) {
              allowed.items.forEach(element => {
                const data = {
                  id: element.id,
                  desc: element.description,
                  day: element.purchaseDay,
                  amount: element.entryAmount,
                  type: element.purchaseType,
                  date: new Date(element.purchaseDate),
                  currCode: element.currCode,
                  addedBy: element.addedBy
                }
                this.totalRecords.push(data);
              });
            } 
            this.getExpenses(this.highTab);
          } else {
            this.toastError("Warning" ,"No records found for the current Month.");
          }
        },
        error => {
          this.toastError("Error ",error);
        });
      } 
    });
  }

  expenseType(tabType) {
    if(tabType == 't1') {
      this.highTab = "t1";
    } else if(tabType == 't2') {
      this.highTab = "t2";
    } else if (tabType == 't3') {
      this.highTab = "t3";
    }
    this.getExpenses(tabType);
  }

  setDate(date) {
    return new Date(date);
  }

  getExpenses(tabType) {
    let chartData = [];
    if(tabType == 't1') {
      chartData = this.updateAllData();
    } else if(tabType == 't2'){
      chartData = this.updateExpenseData();
    } else if(tabType == 't3') {
      chartData = this.updateIncomeDate();
    }
    this.updateBatch();
    this.viewChartEnter(chartData);
  }

  updateBatch() {
    this.totalBatch = this.totalRecords.length;
    this.expenseBatch = this.expenseList.length;
    this.incomeBatch = this.incomeList.length;
  }

  updateIncomeDate(): any[] {
    this.clearList();
    this.updateEandIData();
    this.bothEandIList = this.incomeList;
    this.incomeData = this.calculateGraph('i');
    return this.getChartData([], this.incomeData);
  }

  updateExpenseData(): any[] {
    this.clearList();
    this.updateEandIData();
    this.bothEandIList = this.expenseList;
    this.expenseData = this.calculateGraph('e');
    return this.getChartData(this.expenseData, []);
  }

  updateAllData() {
    this.clearList();
    this.updateEandIData();
    this.bothEandIList = this.totalRecords;
    this.expenseData = this.calculateGraph('e');
    this.incomeData = this.calculateGraph('i');
    return this.getChartData(this.expenseData, this.incomeData);
  }

  updateEandIData() {
    this.totalRecords.forEach(element => {
      if(element.type == 'expense') {
        this.expenseList.push(element);
        this.totalExpense += element.amount;
      } 
      else if(element.type == 'income'){
        this.incomeList.push(element);
        this.totalIncome += element.amount;
      }
    });
    this.totalSavings = this.totalIncome - this.totalExpense;
  }

  clearList() {
    this.totalIncome = 0;
    this.totalExpense = 0;
    this.totalSavings = 0;
    this.bothEandIList = [];
    this.expenseList = [];
    this.incomeList = [];
  }


  getChartData(expenseData: any[], incomeData: any[]) {
    let chartData = [];
    if(expenseData.length > 0) {
      const cData = {
        name: 'Expense',
        type: undefined,
        data: this.expenseData,
        color: '#eb445a'
      };
      chartData.push(cData);
    }
    if(incomeData.length > 0) {
      const cData = {
        name: 'Income',
        type: undefined,
        data: this.incomeData,
        color: '#3880ff'
      };
      chartData.push(cData);
    }
    return chartData;
  }

  calculateGraph(type) {
    let dMon: number = 0, 
        dTue: number = 0, 
        dWed: number = 0, 
        dThu: number = 0, 
        dFri: number = 0, 
        dSat: number = 0, 
        dSun: number = 0;
    let dataList = [];
    if(type == "e") {
      dataList = this.expenseList;
    } else if (type == "i"){
      dataList = this.incomeList;
    }
    let listData = [];
    dataList.forEach(element => {
      switch (element.day) {
      case 'Mon': 
        dMon = dMon + element.amount;
        break; 
      case 'Tue':
        dTue = dTue + element.amount;
        break; 
      case 'Wed':
        dWed = dWed + element.amount;
        break; 
      case 'Thu':
        dThu = dThu + element.amount; 
        break; 
      case 'Fri':
        dFri = dFri + element.amount; 
        break; 
      case 'Sat': 
        dSat = dSat + element.amount;
        break; 
      case 'Sun':
        dSun = dSun + element.amount; 
        break; 
      }
    });
    return listData = [dSun, dMon, dTue, dWed, dThu, dFri, dSat];
  }


  editItem(item) {
    this.presentEditModal(item);
  }

  deleteItem(item) {
    this.presentAlertMultipleButtons(item);
  }

  async presentAlertMultipleButtons(item) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      subHeader: 'Do you want to delete the item?',
      message: 'Press delete or cancel to discard.',
      buttons: ['Cancel', {text: 'Delete', role: 'delete'}]
    });

    await alert.present();
    let result = await alert.onDidDismiss();
    if(result.role == "delete") {
      this.confirmDelete(item);
    }
  }

  confirmDelete(item: any) {
    this.dataService.deleteExpense(item.id).subscribe(allowed => {
      if (allowed) {
        if(allowed.item == "Deleted Successfully") {
          this.toastError("Success",  "Item has been deleted.");
          this.getExpenseData();
        }
      } else {
        this.toastError("Error","Unable to delete the item.");
      }
    },
    error => {
      this.toastError("Error",error);
    });
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ExpenseDialogPage,
      cssClass: 'my-custom-modal-css',
      swipeToClose: true,
      componentProps: {expenseData: "", opType: "save"},
      presentingElement: await this.modalController.getTop()
    });
    modal.onWillDismiss().then(dataReturned => {
      // trigger when about to close the modal
      this.getExpenseData();
    });
    return await modal.present();
  }

  async presentEditModal(item) {
    let expenseData = {
      id: item.id,
      purchaseType: item.type,
      entryAmount: item.amount,
      description: item.desc,
      purchaseDate: item.date,
      purchaseDay: item.day,
      addedBy: item.addedBy,
      userId: this.userId
    };
    const modal = await this.modalController.create({
      component: ExpenseDialogPage,
      cssClass: 'my-custom-modal-css',
      swipeToClose: true,
      componentProps: {expenseData: expenseData, opType: "update"},
      presentingElement: await this.modalController.getTop()
    });
    modal.onWillDismiss().then(dataReturned => {
      // trigger when about to close the modal
      this.getExpenseData();
    });
    return await modal.present();
  }

  viewChartEnter(chartData) {
    this.plotSimpleBarChart(chartData);
  }

  plotSimpleBarChart(chartData) {
    let myChart = HighCharts.chart('highcharts', {
      chart: {
        type: 'column'
      },
      title: {
        text: '(' + this.currentMonth + ') Account Details'
      },
      xAxis: {
        categories: this.daysData
      },
      yAxis: {
        title: {
          text: 'Amount'
        }
      },
      credits: {
        enabled: false
      },
      series: chartData
    });
  }

  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      event.target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      // if (data.length == 1000) {
      //   event.target.disabled = true;
      // }
    }, 500);
  }

  switchTab2(){
    this.nav.navigateForward("/tab2");
  }

  /**
   * Method to scroll to top
   */
  public pageScroller(){
    //scroll to page top
    this.content.scrollToTop();
  }

  async toastError(type,text) {
    const toast = await this.toastController.create({
      header: type,
      message: text,
      duration: 3000,
      position: 'top',
    });
    toast.present();
  }
}
