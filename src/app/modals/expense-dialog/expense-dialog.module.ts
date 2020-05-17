import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExpenseDialogPageRoutingModule } from './expense-dialog-routing.module';

import { ExpenseDialogPage } from './expense-dialog.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExpenseDialogPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ExpenseDialogPage]
})
export class ExpenseDialogPageModule {}
