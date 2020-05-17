import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExpenseDialogPage } from './expense-dialog.page';

const routes: Routes = [
  {
    path: '',
    component: ExpenseDialogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpenseDialogPageRoutingModule {}
