import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { InventoryComponent } from './inventory/inventory.component';
import { MonitorComponent } from './monitor/monitor.component';
import { ReadingComponent } from './reading/reading.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'monitor', component: MonitorComponent },
  { path: 'reading', component: ReadingComponent },
  { path: 'inventory', component: InventoryComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
