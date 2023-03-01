import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryComponent } from './inventory/inventory.component';
import { MonitorComponent } from './monitor/monitor.component';
import { ReadingComponent } from './reading/reading.component';

const routes: Routes = [
  { path: 'monitor', component: MonitorComponent },
  { path: 'reading', component: ReadingComponent },
  { path: 'inventory', component: InventoryComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
