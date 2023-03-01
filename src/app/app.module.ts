import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IMqttServiceOptions, MqttModule } from 'ngx-mqtt';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MonitorComponent } from './monitor/monitor.component';
import { ReadingComponent } from './reading/reading.component';
import { ZebraIoTConnectorService } from './services/zebra-iot-connector-service';
import { InventoryComponent } from './inventory/inventory.component';

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
    InventoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS)
  ],
  providers: [ ZebraIoTConnectorService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
