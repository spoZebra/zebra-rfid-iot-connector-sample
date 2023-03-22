import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IMqttServiceOptions, MqttModule } from 'ngx-mqtt';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MonitorComponent } from './monitor/monitor.component';
import { ReadingComponent } from './reading/reading.component';
import { ZebraIoTConnectorService } from './services/zebra-iot-connector-service';
import { InventoryComponent } from './inventory/inventory.component';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ZebraRmInterfaceService } from './services/zebra-rm-interface-service';

const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: "127.0.0.1",
  port: 1997,
  path: '/mqtt',
};

@NgModule({
  declarations: [
    AppComponent,
    MonitorComponent,
    ReadingComponent,
    InventoryComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS),
    NgxJsonViewerModule
  ],
  providers: [ ZebraIoTConnectorService, ZebraRmInterfaceService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
