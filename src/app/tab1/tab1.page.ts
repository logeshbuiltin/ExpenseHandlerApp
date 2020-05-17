import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import * as HighCharts from 'highcharts';
import { ExpenseDialogPage } from '../modals/expense-dialog/expense-dialog.page';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  expenseData: any[] = [];
  incomeData: any[] = [];
  daysData: any[] = [];
  expenseList: any[] = [];
  incomeList: any[] = [];
  bothEandIList: any[] = [];

  highTab: string = "t1";

  currentMonth: string = "Jan 2020";

  constructor(
    public nav: NavController,
    public modalController: ModalController
  ) {}


  ionViewDidEnter(): void {
    this.daysData = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    this.getExpenses(this.highTab);
  }

  getExpenseData() {
    this.expenseList = [
      {id: 1, desc: "Fuel", day: "Mon", amount: 2500.00, type: "expense", date:'2020-04-05'}, 
      {id: 2, desc: "Dinner", day: "Tue", amount: 500.00, type: "expense", date:'2020-04-07'}, 
      {id: 4, desc: "Shopping", day: "Wed", amount: 6500.00, type: "expense", date:'2020-04-08'},
      {id: 5, desc: "Travel", day: "Fri", amount: 1000.00, type: "expense", date:'2020-04-09'},
      {id: 6, desc: "Lunch", day: "Wed", amount: 2500.00, type: "expense", date:'2020-04-10'},
    ];
    this.incomeList = [
      {id: 3, desc: "Return", day: "Mon", amount: 10500.00, type: "income", date:'2020-04-06'}, 
      {id: 7, desc: "Loan", day: "Tue", amount: 500.00, type: "income", date:'2020-04-09'}, 
      {id: 8, desc: "Income", day: "Wed", amount: 2500.00, type: "income", date:'2020-04-30'},
      {id: 9, desc: "Salary", day: "Thu", amount: 6500.00, type: "income", date:'2020-04-29'},
      {id: 10, desc: "Claim", day: "Fri", amount: 1000.00, type: "income", date:'2020-04-07'},
    ];
    this.bothEandIList = [
      {id: 1, desc: "Income", day: "Wed", amount: 5500.00, type: "income", date:'2020-04-05'},
      {id: 2, desc: "Fuel", day: "Mon", amount: 2500.00, type: "expense",date:'2020-04-05'}, 
      {id: 3, desc: "Dinner", day: "Tue", amount: 500.00, type: "expense",date:'2020-04-05'}, 
      {id: 4, desc: "Return", day: "Mon", amount: 10500.00, type: "income", date:'2020-04-05'},
      {id: 5, desc: "Shopping", day: "Wed", amount: 6500.00, type: "expense", date:'2020-04-05'},
      {id: 6, desc: "Travel", day: "Fri", amount: 1000.00, type: "expense", date:'2020-04-05'},
      {id: 7, desc: "Income", day: "Wed", amount: 2500.00, type: "income",date:'2020-04-05'},
      {id: 8, desc: "Lunch", day: "Wed", amount: 2500.00, type: "expense", date:'2020-04-05'},
      {id: 9, desc: "Salary", day: "Thu", amount: 6500.00, type: "income", date:'2020-04-05'},
      {id: 10, desc: "Claim", day: "Fri", amount: 1000.00, type: "income", date:'2020-04-05'},
    ];
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
    this.getExpenseData();
    let chartData = [];
    if(tabType == 't1') {
      this.expenseList = [];
      this.incomeList = [];
      this.bothEandIList.forEach(element => {
        if(element.type == "expense") {
          this.expenseList.push(element);
        } else {
          this.incomeList.push(element);
        }
      });
      this.expenseData = this.calculateGraph('e');
      this.incomeData = this.calculateGraph('i');
      chartData = this.getChartData(this.expenseData, this.incomeData);
    } else if(tabType == 't2'){
      this.bothEandIList = [];
      this.expenseList.forEach(element => {
        this.bothEandIList.push(element);
      });
      this.incomeData = [];
      this.expenseData = this.calculateGraph('e');
      chartData = this.getChartData(this.expenseData, []);
    } else if(tabType == 't3') {
      this.bothEandIList = [];
      this.incomeList.forEach(element => {
        this.bothEandIList.push(element);
      });
      this.expenseData = [];
      this.incomeData = this.calculateGraph('i');
      chartData = this.getChartData([], this.incomeList);
    }
    this.viewChartEnter(chartData);
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
    } else {
      dataList = this.incomeList;
    }
    let listData = [];
    dataList.forEach(element => {
      switch (element.day) {
      case 'Mon': 
        dMon =+ element.amount;
        break; 
      case 'Tue':
        dTue =+ element.amount;
        break; 
      case 'Wed':
        dWed =+ element.amount;
        break; 
      case 'Thu':
        dThu =+ element.amount; 
        break; 
      case 'Fri':
        dFri =+ element.amount; 
        break; 
      case 'Sat': 
        dSat =+ element.amount;
        break; 
      case 'Sun':
        dSun =+ element.amount; 
        break; 
      }
    });
    return listData = [dSun, dMon, dTue, dWed, dThu, dFri, dSat];
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

  editItem(item) {
    console.log("edited");
  }

  deleteItem(item) {
    console.log("deleted");
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ExpenseDialogPage,
      cssClass: 'my-custom-modal-css',
      swipeToClose: true,
      presentingElement: await this.modalController.getTop()
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
}
